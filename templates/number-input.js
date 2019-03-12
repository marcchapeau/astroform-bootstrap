import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'

import './number-input.html'

Template.astroNumberInput.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroNumberInput.onRendered(function () {
  const { name } = Template.currentData()
  this.$(`[name="${name}"]`).val(this.form.doc[name])
})

Template.astroNumberInput.helpers({
  hasError () {
    const form = Template.instance().form
    if (form) return form.errors.get(this.name)
  },
  submitted () {
    const form = Template.instance().form
    return form.submitted.get()
  }
})

Template.astroNumberInput.events({
  'change/input input' (evt, tpl) {
    if (evt.currentTarget.value === '') tpl.form.fields.set(this.name, null)
    else tpl.form.fields.set(this.name, evt.currentTarget.value)
  }
})
