import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'

import './select-input.html'

Template.astroSelectInput.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroSelectInput.onRendered(function () {
  const { name } = Template.currentData()
  if (this.form.doc && this.form.doc[name]) {
    this.$(`[name="${name}"]`).val(this.form.doc[name])
  }
})

Template.astroSelectInput.helpers({
  hasError () {
    const form = Template.instance().form
    if (form) return form.errors.get(this.name)
  },
  submitted () {
    const form = Template.instance().form
    return form.submitted.get()
  },
  isSelected () {
    const { name } = Template.currentData()
    const form = Template.instance().form
    return form.doc[name] === this.value
  }
})

Template.astroSelectInput.events({
  'change select' (evt, tpl) {
    if (evt.currentTarget.value === '' && tpl.form.doc[evt.currentTarget.name]) {
      tpl.form.fields.set(this.name, null)
    } else {
      tpl.form.fields.set(this.name, evt.currentTarget.value)
    }
  }
})
