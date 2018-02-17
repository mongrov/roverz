# RocketChat package

## Todo
   * livechat to be included in groups
   * login multiple times should be tested - memory leak and cleanup of handlers to be done
   * error handling in fetchChannels
   * if there are more than 200 groups, we need to see how calls can be batched (_fetchMessages*)
   * don't fetch all messages at start, fetch only groups that are most used ? especially only direct messages and next private groups
   * on load, when we sync with backend - if there are deleted messages in a group, how to handle

