import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'
import { EJSON } from 'meteor/ejson'

import './text-area.html'

Template.astroTextArea.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroTextArea.onRendered(function () {
  const { name } = Template.currentData()
  if (this.form.doc && this.form.doc[name]) {
    this.$(`[name="${name}"]`).val(this.form.doc[name])
  }
})

Template.astroTextArea.helpers({
  hasError () {
    const form = Template.instance().form
    if (form) return form.errors.get(this.name)
  },
  submitted () {
    const form = Template.instance().form
    return form.submitted.get()
  }
})

Template.astroTextArea.events({
  'change/input textarea' (evt, tpl) {
    if (evt.currentTarget.value === '') tpl.form.fields.set(this.name, null)
    else tpl.form.fields.set(this.name, evt.currentTarget.value)
  }
})
