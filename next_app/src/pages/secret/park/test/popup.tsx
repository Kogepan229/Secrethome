import { useState } from "react"
import Popup from "components/PopupWindowMessage"
import SimpleButton from "components/SimpleButton"


const TestPopup = (props: any) => {
  const [isOpenedPopup, setIsOpenedPopup] = useState(true)

  const OpenPopupButton = () => {
    //console.log(props.tags)
    if (!isOpenedPopup) {
      //return <TagModal isShow={isOpenedModal} closeCallback={() => setIsOpenedModal(false)} selectTagCallback={selectTagCallback} tagList={props.tags} excludeTagIDList={excludeTagIDList}/>
      return <SimpleButton onClick={() => setIsOpenedPopup(true)}>Open Popup</SimpleButton>
      //return <button onClick={() => setIsOpenedPopup(true)}>Open Popup</button>
    } else {
      return null
    }
  }
  return (
    <>
      <Popup isShow={isOpenedPopup} message="追加しました" buttonText="戻る" buttonCallback={() => setIsOpenedPopup(false)}/>
      <OpenPopupButton/>
    </>
  )
}

export default TestPopup