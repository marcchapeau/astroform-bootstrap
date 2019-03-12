import Astroform from 'meteor/astroform'
import { Template } from 'meteor/templating'
import './hidden-input.html'

Template.astroHiddenInput.onCreated(function () {
  const { id, name, value } = Template.currentData()
  this.form = Astroform.forms[id]
  this.form.fields.set(name, value)
})
