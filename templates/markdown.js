import { Astroform } from 'meteor/chap:astroform'
import { Template } from 'meteor/templating'
import { Random } from 'meteor/random'
import { ReactiveVar } from 'meteor/reactive-var'

import './markdown.html'

Template.astroMarkdown.onCreated(function () {
  this.formId = this.data.formId
  this.id = Random.id()
  this.name = this.data.name
  this.form = Astroform.forms[this.formId]
  this.value = this.data.value
  if (this.value !== undefined) {
    this.form.fields.set(this.name, this.value)
  } else if (this.form.doc[this.name] !== undefined) {
    this.form.fields.set(this.name, this.form.doc[this.name])
  }
  this.preview = new ReactiveVar(false)
})

Template.astroMarkdown.helpers({
  hasError () {
    const instance = Template.instance()
    return instance.form.errors.get(instance.name)
  },
  id: () => Template.instance().id,
  isTextarea () { return this.cols || this.rows },
  preview: () => Template.instance().preview.get(),
  required () {
    const instance = Template.instance()
    return !instance.form.astro.getField(instance.name).optional
  },
  submitted: () => Template.instance().form.submitted.get(),
  value: () => {
    const instance = Template.instance()
    const value = instance.form.fields.get(instance.name)
    return value !== null ? value : ''
  }
})

Template.astroMarkdown.events({
  'click [js-toggle]' (event, instance) {
    instance.preview.set(!instance.preview.get())
  },
  'change/input input, change/input textarea' (event, instance) {
    const value = event.currentTarget.value
    instance.form.fields.set(instance.name, value !== '' ? value : null)
  }
})
