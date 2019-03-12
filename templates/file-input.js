import Astroform from 'meteor/astroform'
import { FilesCollection } from 'meteor/ostrio:files'
import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { Template } from 'meteor/templating'

import './file-input.html'

Template.astroFileInput.onCreated(function () {
  const { id } = Template.currentData()
  this.currentUpload = new ReactiveVar(false)
  this.form = Astroform.forms[id]
})

Template.astroFileInput.events({
  'click [data-action="cancelUpload"]' (evt, tpl) {
    const upload = tpl.currentUpload.get()
    if (upload) {
      upload.abort()
      tpl.currentUpload.set(false)
    }
  },
  'change input' (evt, tpl) {
    if (!this.filesCollection || !(this.filesCollection instanceof FilesCollection)) {
      throw new Meteor.Error('You must specify the filesCollection argument to astroField with type "file"')
    }
    const fi = evt.currentTarget
    if (fi && fi.files[0]) {
      tpl.$(fi).next('.form-control-file').addClass('selected').html(fi.files[0].name)
      const upload = this.filesCollection.insert({
        file: fi.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false)
      upload.on('start', function () {
        tpl.currentUpload.set(this)
      })
      upload.on('end', (err, f) => {
        if (err) console.log('error during upload', err)
        else {
          tpl.form.fields.set(this.name, f._id)
          tpl.currentUpload.set(false)
        }
      })
      upload.on('error', (err, f) => {
        tpl.form.fields.set(this.name, null)
        tpl.form.errors.set(this.name, err.reason)
      })
      upload.start()
    }
  }
})

Template.astroFileInput.helpers({
  hasError () {
    const form = Template.instance().form
    return form.errors.get(this.name)
  },
  fileLabel () { return this.fileLabel || 'Choose a file...' },
  currentUpload: () => Template.instance().currentUpload.get(),
  previewContext () {
    const form = Template.instance().form
    if (form.doc[this.name]) {
      const file = this.filesCollection.findOne(form.doc[this.name])
      const context = {
        preview: Template[this.customPreview] || Template.astroFileInputPreview,
        currentFile: file,
        onDelete: this.onDelete,
        form,
        name: this.name
      }
      return context
    }
  },
  currentFile () {
    const form = Template.instance().form
    const doc = form.doc[this.name]
    const field = form.fields.get(this.name)
    if (this.filesCollection) {
      return this.filesCollection.findOne(doc || field || '')
    }
  }
})

Template.astroFileInputPreview.events({
  'click [data-action="afDeleteFile"]' (evt, tpl) {
    if (!this.onDelete) return
    this.onDelete(this.currentFile._id, err => {
      if (!err) this.form.fields.set(this.name, null)
    })
  }
})
