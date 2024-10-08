import {Notification, Notifications, Registered, RegistrationError} from 'react-native-notifications';

const notific= {
  body: "Local notification!",
  title: "Local Notification Title",
  sound: "chime.aiff",
  silent: false,
  category: "SOME_CATEGORY",
  userInfo: { },
  fireDate: new Date(Date.now() + 5000)
}

export const scheduleLocalNotific =  (notification:any,id:number)=> Notifications.postLocalNotification(
notification, id)


export const localNotificTapAction= ()=> 
  Notifications.events().registerNotificationOpened(
  ({notificationId, notification}:any) => {
    // Perform your desired action on notification tap
  }
);


 export const foregroundNotifics =  Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      completion({alert: false, sound: false, badge: false});
});

  Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
      completion();
});
    
    
    Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
            // TODO: Send the token to my server so it could send back push notifications...
    });
    
    Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
            console.error(event);
    });    








