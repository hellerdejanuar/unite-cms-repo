const STD_PARTICIPANTS_FIELDS = {
  populate: {
    profile_image: {
      fields: ['formats']
    }
  },
  fields: [
    'id',
    'username',
    'phone',
  ]
}

const STD_EVENT_HOST_FIELDS = {
  populate: {
    profile_image: {
      fields: ['formats']
    }
  },
  fields: [
  'id',
  'username',
  'phone',
  ]
}

module.exports = { 
  STD_POPULATE_EVENT: {
    image: { fields: ['formats'] },
    event_host: STD_EVENT_HOST_FIELDS, 
    participants: STD_PARTICIPANTS_FIELDS,
  },

  STD_EVENT_FIELDS: [
    'name', 
    'id',
    'max_people',
    'is_full',
    'event_datetime',
    'location',
    'online',
    'description',
  ],
}