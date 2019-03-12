import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor'

import './search-tags.html'

Template.astroSearchTags.onCreated(function () {
  const { id, name, searchSource, unique = true } = Template.currentData()
  this.form = Astroform.forms[id]
  this.name = name
  this.unique = unique
  this.search = new ReactiveVar('')
  this.searching = new ReactiveVar(false)
  this.searchTags = new ReactiveVar([])
  this.selectedTags = new ReactiveVar([])
  if (this.form.doc[name]) this.form.fields.set(this.name, this.form.doc[name])
  if (this.form.fields.get(this.name)) {
    searchSource(null, this.form.fields.get(this.name), (err, res) => {
      if (!err) {
        const sTags = this.form.fields.get(this.name).map(t => {
          const tmp = res.find(sTag => sTag.value === t)
          return {value: t, label: tmp ? tmp.label : t}
        })
        this.selectedTags.set(sTags)
      }
    })
  }
})

Template.astroSearchTags.helpers({
  search () { return Template.instance().search.get() },
  searching () { return Template.instance().searching.get() },
  searchTags () { return Template.instance().searchTags.get() },
  selectedTags () { return Template.instance().selectedTags.get() },
  hasError () { return Template.instance().form.errors.get(this.name) }
})

Template.astroSearchTags.events({
  'input input' (evt, tpl) {
    if (tpl.timeout) {
      Meteor.clearTimeout(tpl.timeout)
      tpl.timeout = undefined
    }
    tpl.timeout = Meteor.setTimeout(() => {
      tpl.search.set(evt.currentTarget.value)
      const search = tpl.search.get()
      if (search === '') tpl.searchTags.set([])
      else {
        tpl.searching.set(true)
        const selectedTags = tpl.selectedTags.get().map(t => t.value)
        this.searchSource(search, tpl.unique ? selectedTags : [], (err, res) => {
          tpl.searching.set(false)
          if (!err) tpl.searchTags.set(res)
        })
      }
      tpl.timeout = undefined
    }, 250)
  },
  'click [data-action="select"]' (evt, tpl) {
    if (!tpl.form.fields.get(tpl.name)) tpl.form.fields.set(tpl.name, [])
    if (!tpl.unique || tpl.form.fields.get(tpl.name).indexOf(this.value) === -1) {
      tpl.form.fields.set(tpl.name, tpl.form.fields.get(tpl.name).concat(this.value))
      tpl.selectedTags.set(tpl.selectedTags.get().concat(this))
    }
  },
  'click [data-action="unselect"]' (evt, tpl) {
    const index = tpl.$(evt.currentTarget).data('index')
    const fields = tpl.form.fields.get(tpl.name)
    fields.splice(index, 1)
    tpl.form.fields.set(tpl.name, fields)
    const selectedTags = tpl.selectedTags.get()
    selectedTags.splice(index, 1)
    tpl.selectedTags.set(selectedTags)
  }
})
