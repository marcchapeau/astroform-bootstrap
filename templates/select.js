import { Astroform } from 'meteor/chap:astroform'
import { Template } from 'meteor/templating'
import { Random } from 'meteor/random'

import './select.html'

Template.astroSelect.onCreated(function () {
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
})

Template.astroSelect.helpers({
  hasError () {
    const instance = Template.instance()
    return instance.form.errors.get(instance.name)
  },
  id: () => Template.instance().id,
  isSelected (value) {
    const instance = Template.instance()
    console.log(instance.form.fields.get(instance.name), value)
    return instance.form.fields.get(instance.name) === value
  },
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

Template.astroSelect.events({
  'change select' (event, instance) {
    console.log('IIC')
    const value = event.currentTarget.value
    instance.form.fields.set(instance.name, value !== '' ? value : null)
  }
})
