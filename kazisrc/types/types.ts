export type Theme = {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      postBackground:string;
  };


export  interface HomeMenuProps {
    Icon: any; // Update with the appropriate type for your icons
    onPress?: () => void;
    backColor?:string;
    contentTextColor?:string | any;
    headerTextColor?:string | any;
    iconSize?: number;
    iconColor?: string;
    header: string;
    content: string;
    iconName: string;
  }


  