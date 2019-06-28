import { Astroform } from 'meteor/chap:astroform'
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ValidationError } from 'meteor/jagi:astronomy'
import { Tracker } from 'meteor/tracker'

import './templates/input'
import './templates/markdown'
import './templates/select'
import './templates/switch'
import './index.html'

Template.astroForm.onCreated(function () {
  this.astro = this.data.astro
  const Astro = this.astro
  this.doc = this.data.doc instanceof Astro ? this.data.doc : new Astro(this.data.doc)
  this.formId = this.data.id
  this.horizontal = this.data.horizontal
  this.validateOptions = this.data.validateOptions
  this.form = Astroform.addForm(this.formId, this.astro, this.doc)
  this.validate = (submit = false) => {
    this.form.errors.clear()
    if (submit && this.form.hooks['formToClass']) {
      if (this.form.hooks['formToClass'].call(this.doc) === false) return
    }
    this.doc.validate({ cast: true, stopOnFirstError: false, ...this.validateOptions }, err => {
      if (err && !ValidationError.is(err)) {
        throw new Meteor.Error(err)
      } else if (err) {
        err.details.map(detail => {
          this.form.errors.set(detail.name, detail.message)
        })
        if (submit && this.form.hooks['onError']) {
          this.form.hooks['onError'].call(this.doc, this.form.errors.all())
        }
      } else {
        if (submit && this.form.hooks['onSuccess']) {
          this.form.hooks['onSuccess'].call(this.doc)
        }
      }
    })
  }
  this.autorun(() => {
    const fields = this.form.fields.all()
    let submitted
    Tracker.nonreactive(() => { submitted = this.form.submitted.get() })
    let change = false
    Object.keys(fields).forEach(key => {
      if (this.form.doc[key] !== fields[key]) {
        this.form.doc[key] = fields[key]
        change = true
      }
    })
    if (submitted && change) this.validate()
  })
})

Template.astroForm.helpers({
  data () {
    const instance = Template.instance()
    return {
      formId: instance.formId,
      horizontal: !!instance.horizontal
    }
  }
})

Template.astroForm.events({
  'submit form' (event, instance) {
    event.preventDefault()
    instance.form.submitted.set(true)
    instance.validate(true)
  }
})

Template.astroForm.onDestroyed(function () {
  Astroform.removeForm(this.formId)
})

Template.astroField.onCreated(function () {
  this.data.formId = Template.parentData().formId
  this.data.horizontal = Template.parentData().horizontal
})

Template.astroField.helpers({
  data () {
    let data = Template.instance().data
    const field = Astroform.forms[data.formId].astro.getField(data.name)
    console.log(field)
    if (field.astroform) data = { ...field.astroform, ...data }
    return data
  },
  template () {
    const type = this.type || 'text'
    const templates = {
      email: 'astroInput',
      markdown: 'astroMarkdown',
      number: 'astroInput',
      password: 'astroInput',
      select: 'astroSelect',
      switch: 'astroSwitch',
      text: 'astroInput'
      // file: 'astroFileInput',
      // datePicker: 'astroDatePicker',
      // hidden: 'astroHiddenInput',
      // searchTags: 'astroSearchTags',
      // selectTags: 'astroSelectTags',
      // textarea: 'astroTextArea',
      // time: 'astroTimeInput',
      // date: 'astroDateInput',
      // select: 'astroSelectInput',
      // password: 'astroTextInput',
      // email: 'astroTextInput',
      // checkbox: 'astroCheckboxInput'
    }
    return templates[type] || 'astroInput'
  }
})
