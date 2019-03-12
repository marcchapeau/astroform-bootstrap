import './time-input.html'

import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'

Template.astroTimeInput.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroTimeInput.onRendered(function () {
  const { name } = Template.currentData()
  const form = this.form
  this.$(`[name="${name}"]`).val(form.doc[name])
})

Template.astroTimeInput.helpers({
  hasError () {
    const form = Template.instance().form
    return form.errors.get(this.name)
  }
})

Template.astroTimeInput.events({
  'change/input input' (evt, tpl) {
    if (evt.currentTarget.value === '') {
      tpl.form.fields.set(this.name, null)
    } else tpl.form.fields.set(this.name, evt.currentTarget.value)
  }
})
