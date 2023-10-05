## User ----------------------------------------
  user restrictins: 
    confirmed: true
    blocked: false
    status: true

# Public data ---
  public_name:  { read: ['everyone'], 
                  update: ['me'] }
  profile_image:  { read: ['everone'], 
                    update: ['me'] }

  // relational data ( update methods: connect, disconnect, set )
  hosted_events:    { read: ['friends','me'], 
                      update: ['system'] }
  attending_events: { read: ['me'], 
                      update: ['system'] }
  friends:  { read: ['me'], 
              update: ['system'] }
  incoming_friend_requests: { read: ['me'], 
                            update: ['system'] }
  sent_friend_requests:  { read: ['me'], 
                              update: ['system'] }


# Private data --
  // custom
  phone 
  status

  // stock
  username
  password
  email
  provider
  resetPasswordToken
  confirmationToken
  confirmed
  blocked
  role
  
