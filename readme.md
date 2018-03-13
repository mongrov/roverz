![alt text][logo]

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

[logo]: src/images/logo-inverse.png "roverz"

A native mobile chat client library for [Rocket.Chat](https://rocket.chat/) on both iOS and Android.

## Screenshots
![Screenshots][screenshots]

[screenshots]: docs/assets/roverz-screens.jpg "Screenshots"

## Features

Overview of features that are supported in this library
   * groups
      * private (groups)
      * public(channels)
      * 1:1 (direct)
   * messages
      * text
      * image
         * camera & gallery
         * caching
         * pinch and zoom
      * video attachments
      * emoji support
      * threaded messages
   * user/group profile pages

You can embed this library to have collaboration in your application.

## Demo / Quick Start

1. You can download mongrov official app from app store
   * https://itunes.apple.com/us/app/mongrov/id1313167859?ls=1&mt=8
   * https://play.google.com/store/apps/details?id=com.mongrov.app
1. On install, tap on `app.mongrov.com` under label `WORKSPACE`
1. give your rocket.chat server on the page (if you dont have one, you can use open.rocket.chat or register with app.mongrov.com)
1. once logged in you can use full features of the app with your server

NOTE: if you want to use notifications, please use app.mongrov.com

## roverz Quick Start
A fully working example have been included in example directory. 

```
# clone source
git clone https://github.com/mongrov/roverz.git
cd mongrov/example

# install all dependencies
npm install

# start the service in a separate terminal
npm start -- --reset-cache

# for iOS
react-native run-ios
# for android
react-native run-android
```

## Usage

In order to include this library into your project, issue to your react-native project

```
npm install --save https://github.com/mongrov/roverz
```

## Questions / Issues
If you got any questions or problems using, please visit our [Github Repository](https://github.com/mongrov/roverz) and write an issue.  

## Contributing
We're happy to include any type of contribution! This can be:

   * bug/issues 
   * code fixes
   * language translations
   * writing documentation & demos

See [CONTRIBUTING](CONTRIBUTING) for further information.

## License

    Apache License, Version 2.0

See [LICENSE](LICENSE) for full details.

This project is supported and donated by
- [Mongrov, Inc](mongrov.com)
- [Elix Labs](elix.ai)
