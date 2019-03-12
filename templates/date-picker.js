import './date-picker.html'

import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { EJSON } from 'meteor/ejson'

const pad = n => n < 10 ? `0${n}` : n

const getStringHour = date => date
  ? `${pad(date.getHours())}:${pad(date.getMinutes())}`
  : undefined

const getStringDate = date => date
  ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  : undefined

const handler = function (name) {
  return function (evt, tpl) {
    if (name === 'date') tpl.date.set(evt.currentTarget.value)
    else if (name === 'hour') tpl.hour.set(evt.currentTarget.value)
    const timestamp = new Date(`${tpl.date.get()}T${tpl.hour.get()}`)
    if (!isNaN(timestamp.valueOf())) {
      tpl.form.fields.set(this.name, timestamp)
    } else if (tpl.form.submitted.get()) tpl.form.errors.set(this.name, 'Date invalide')
  }
}

Template.astroDatePicker.onCreated(function () {
  const { id, name } = Template.currentData()
  this.form = Astroform.forms[id]
  const date = this.form.doc[name]
  this.date = new ReactiveVar(getStringDate(date))
  this.hour = new ReactiveVar(getStringHour(date))
})

Template.astroDatePicker.onRendered(function () {
  const { name } = Template.currentData()
  const date = this.date.get()
  const hour = this.hour.get()
  this.$(`[name="hour${name}"]`).val(hour)
  this.$(`[name="date${name}"]`).val(date)
})

Template.astroDatePicker.helpers({
  hasError () {
    const form = Template.instance().form
    return form.errors.get(this.name)
  },
  submitted () {
    const form = Template.instance().form
    return form.submitted.get()
  }
})

Template.astroDatePicker.events({
  'change/input .date': handler('date'),
  'change/input .hour': handler('hour')
})
