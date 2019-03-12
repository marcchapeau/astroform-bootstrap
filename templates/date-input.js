import './date-input.html'

import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'

const pad = n => n < 10 ? `0${n}` : n

const getStringDate = date => date
  ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  : undefined

Template.astroDateInput.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroDateInput.onRendered(function () {
  const { name } = Template.currentData()
  const form = this.form
  const dateString = getStringDate(form.doc[name])
  this.$(`[name="${name}"]`).val(dateString)
})

Template.astroDateInput.helpers({
  hasError () {
    const form = Template.instance().form
    return form.errors.get(this.name)
  }
})

Template.astroDateInput.events({
  'change/input input' (evt, tpl) {
    if (evt.currentTarget.value === '') {
      tpl.form.fields.set(this.name, null)
    } else tpl.form.fields.set(this.name, evt.currentTarget.value)
  }
})
