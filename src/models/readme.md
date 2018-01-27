# Models package

## naming schema 
   * entity should be named in lower case (example, User -> user) and singular
   * entity manager should be in upper case (example user manager -> UserManager)

## Todo
  * consistent naming
  * remove elix/yap from everywhere
  * test cases not only to call the method, they should verify the result - otherwise it doesnt' make sense
     * remove the console.log
     * add automation to verify results of each operation
  * User 
     * statusConnection to be removed
     * emails - change to email
     * avatar to be moved to ModuleConfig ? 
     * active - why do we want this ?
     * UserManager methods - updateStatus & updateFullUserData
  * Group
     * avatar to be moved outside as well - as this is tight coupling
     * GroupManager - updateNoMoreMessages - can it be a candidate for Group setter 
     * findRootMessage - shall we cache it in datastructure, so after we compute, we need not again
     * findMissingMessages - why do we check likes ?
  * Message
     * original - should be removed
  * RemoteFile
     * in settings add a button to clear cache and wire it
     * if just key is coming in, don't add or delete from cache?
  
