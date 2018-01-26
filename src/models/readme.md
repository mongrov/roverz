# Models package

## naming schema 
   * entity should be named in lower case (example, User -> user)
   * entity manager should be in upper case (example user manager -> UserManager)

## Todo
  * consistent naming
  * remove elix/yap from everywhere
  * User 
     * statusConnection to be removed
     * emails - change to email
     * avatar to be moved to ModuleConfig ? 
     * active - why do we want this ?
     * UserManager methods - updateStatus & updateFullUserData
  * Group
     * avatar to be moved outside as well - as this is tight coupling
     * 