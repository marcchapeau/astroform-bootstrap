import { Astroform } from 'meteor/chap:astroform'
import { Template } from 'meteor/templating'
import { Random } from 'meteor/random'

import './switch.html'

Template.astroSwitch.onCreated(function () {
  this.formId = this.data.formId
  this.id = Random.id()
  this.name = this.data.name
  this.form = Astroform.forms[this.formId]
  this.checked = this.data.checked
  if (this.checked !== undefined) {
    this.form.fields.set(this.name, this.checked)
  } else if (this.form.doc[this.name] !== undefined) {
    this.form.fields.set(this.name, this.form.doc[this.name])
  }
})

Template.astroSwitch.helpers({
  checked () {
    const instance = Template.instance()
    return instance.form.fields.get(instance.name)
  },
  hasError () {
    const instance = Template.instance()
    return instance.form.errors.get(instance.name)
  },
  id: () => Template.instance().id,
  submitted: () => Template.instance().form.submitted.get()
})

Template.astroSwitch.events({
  'change input' (event, instance) {
    const checked = event.currentTarget.checked
    instance.form.fields.set(instance.name, checked)
  }
})
