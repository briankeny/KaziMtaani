import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openModal: false,
  modalStatus: "",
  modalHeader :"",
  modalContent: ""
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      toggleModal :(state,action) =>{
        state.openModal = action.payload
      },
      setModal : (state,action)=> {
        const {key,val} = action.payload
        switch(key){
            case 'status':
                state.modalStatus =val
                break;
            case 'header':
                    state.modalHeader =val
                break;
            case 'content':
                 state.modalContent =val
                 break;
            default :
            break;
        }
      },
      clearModal: (state)=> {
        state.openModal = false;
        state.modalHeader=''
        state.modalContent=''
        state.modalStatus = ''
      },
    
    }
}
)

interface ModalProps {
   dispatch:any;
   header ?:string;
   status?:string;
   content?:string;
   open?:boolean;
   children?:any
}


export const {toggleModal, setModal,clearModal} = modalSlice.actions

export function rendermodal({dispatch,header="",status="info",content="",open=true}:ModalProps){
  dispatch(clearModal());
  dispatch(setModal({key:'header', val:header}));
  dispatch(setModal({key:'status', val:status}));
  dispatch(setModal({key:'content', val:content}));
  dispatch(toggleModal(open));
  return true
}


export default  modalSlice.reducer