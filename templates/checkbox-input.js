import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'

import './checkbox-input.html'

Template.astroCheckboxInput.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroCheckboxInput.onRendered(function () {
  const { name, checked } = Template.currentData()
  const form = this.form
  if (form.doc[name]) {
    this.$(`[name="${name}"]`).prop('checked', form.doc[name])
  } else if (checked !== undefined) {
    this.$(`[name="${name}"]`).prop('checked', checked)
    form.fields.set(name, checked)
  } else {
    this.$(`[name="${name}"]`).prop('checked', false)
    form.fields.set(name, false)
  }
})

Template.astroCheckboxInput.helpers({
  hasError () {
    const form = Template.instance().form
    return form.errors.get(this.name)
  },
  submitted () {
    const form = Template.instance().form
    return form.submitted.get()
  }
})

Template.astroCheckboxInput.events({
  'change input' (evt, tpl) {
    tpl.form.fields.set(this.name, tpl.$(evt.currentTarget).prop('checked'))
  }
})
