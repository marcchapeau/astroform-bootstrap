import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import './select-tags.html'

Template.astroSelectTags.onCreated(function () {
  const { id, name, unique = true, initializer } = Template.currentData()
  this.form = Astroform.forms[id]
  this.name = name
  this.unique = unique
  this.selectedTags = new ReactiveVar([])
  this.selectName = this.name + 'select'
  if (this.form.doc[name]) this.form.fields.set(this.name, this.form.doc[name])
  const values = this.form.fields.get(this.name)
  if (values && initializer) {
    const tags = values.map(initializer)
    this.selectedTags.set(tags)
  }
})

Template.astroSelectTags.helpers({
  getOptions (options) {
    if (Array.isArray(options)) {
      const instance = Template.instance()
      const selectedTags = instance.selectedTags.get()
      return options.filter(opt => !selectedTags.find(st => st.value === opt.value))
    } else return []
  },
  getName () {
    return Template.instance().selectName
  },
  selectedTags () {
    const res = Template.instance().selectedTags.get()
    return res
  },
  hasError () {
    const { form, name } = Template.instance()
    return form.errors.get(name)
  }
})

Template.astroSelectTags.events({
  'change select' (evt, tpl) {
    const value = evt.currentTarget.value
    const tag = this.options.find(_ => _.value === value)
    if (!tpl.form.fields.get(tpl.name)) tpl.form.fields.set(tpl.name, [])
    if (tpl.form.fields.get(tpl.name).indexOf(value) === -1) {
      tpl.form.fields.set(tpl.name, tpl.form.fields.get(tpl.name).concat(value))
      tpl.selectedTags.set(tpl.selectedTags.get().concat(tag))
    }
    tpl.$(`[name="${tpl.selectName}"]`).val('')
  },
  'click [data-action="unselect"]' (evt, tpl) {
    const index = tpl.$(evt.currentTarget).data('index')
    const fields = tpl.form.fields.get(tpl.name)
    fields.splice(index, 1)
    tpl.form.fields.set(tpl.name, fields)
    const selectedTags = tpl.selectedTags.get()
    selectedTags.splice(index, 1)
    tpl.selectedTags.set(selectedTags)
    tpl.$(`[name="${tpl.selectName}"]`).val('')
  }
})
