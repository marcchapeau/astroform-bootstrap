import './field-message.html'

import { Template } from 'meteor/templating'
import { EJSON } from 'meteor/ejson'

Template.astroFieldMessage.onCreated(function () {
  const { id } = Template.currentData()
  this.form = Astroform.forms[id]
})

Template.astroFieldMessage.helpers({
  astroFieldMessage (name) {
    return Template.instance().form.errors.get(name)
  }
})
