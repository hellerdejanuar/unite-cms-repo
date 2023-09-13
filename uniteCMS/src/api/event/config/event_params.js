const STD_IMAGE_FIELDS = {
  fields: ['formats']
}

const STD_PARTICIPANTS_FIELDS = {
  populate: {
    profile_image: STD_IMAGE_FIELDS
  },
  fields: [
    'id',
    'username',
    'phone',
  ]
}

const STD_EVENT_HOST_FIELDS = {
  populate: {
    profile_image: STD_IMAGE_FIELDS
  },
  fields: [
  'id',
  'username',
  'phone',
  ]
}


    

  const STD_EVENT_FIELDS = {
    populate: {
      image: STD_IMAGE_FIELDS,
      event_host: STD_EVENT_HOST_FIELDS, 
      participants: STD_PARTICIPANTS_FIELDS,
    },
    fields: [
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

  const STD_FRIEND_FIELDS = {
    populate: {
      profile_image: STD_IMAGE_FIELDS,
      hosted_events: STD_EVENT_FIELDS,
    },
    fields: [
      'id',
      'username',
    ]
  }

module.exports = { 


  STD_FRIEND_FIELDS,

  STD_EVENT_FIELDS,
}

