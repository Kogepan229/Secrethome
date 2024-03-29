'use client'
import SimpleButton from 'components/SimpleButton'
import css from './EditContentForm.module.scss'
import React, { useMemo, useState } from 'react'

const EditImage = ({
  imageSrc,
  isEnableSaveImage,
  setImage,
  setUpdated,
  getVideoImage,
}: {
  imageSrc?: string
  isEnableSaveImage: boolean
  setImage: React.Dispatch<React.SetStateAction<File | null>>
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>
  getVideoImage: () => Promise<File | null>
}) => {
  const [_imageSrc, setImageSrc] = useState(imageSrc)
  const [imageName, setImageName] = useState('未選択')

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        canvas.getContext('2d')!.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
        canvas.toBlob(
          blob => {
            if (!blob) return
            const imageFile = new File([blob], 'image.webp', { type: 'image/webp' })
            setImage(imageFile)
            setImageSrc(URL.createObjectURL(blob))
            setImageName(imageFile.name)
            setUpdated(true)
          },
          'image/webp',
          1
        )
      }

      image.src = URL.createObjectURL(e.target.files[0])
    }
  }

  const saveImageFromVideo = () => {
    getVideoImage().then(imageFile => {
      if (imageFile) {
        setImage(imageFile)
        setImageSrc(URL.createObjectURL(imageFile))
        setImageName('画像: 動画から取得')
        setUpdated(true)
      }
    })
  }

  return (
    <>
      <div>
        <h4 className={css.item_header}>サムネイル</h4>
        <div className={css.input_file_container}>
          <label className={css.input_file}>
            <input type="file" accept="image/*" onChange={handleChangeImage}></input>
            ファイルを選択
          </label>
          <SimpleButton type="button" className={css.button_save} disabled={!isEnableSaveImage} onClick={saveImageFromVideo}>
            動画からセーブ
          </SimpleButton>
          <p className={css.input_file_name}>{imageName}</p>
        </div>
      </div>
      <div className={css.image_div}>
        <img src={_imageSrc}></img>
      </div>
    </>
  )
}

export const useEditImage = ({
  isVideoStopped,
  getVideoImage,
  imageSrc,
}: {
  isVideoStopped: boolean
  getVideoImage: () => Promise<File | null>
  imageSrc?: string
}) => {
  const [image, setImage] = useState<File | null>(null)
  const [updated, setUpdated] = useState(false)

  const editImage = useMemo(
    () => (
      <EditImage
        imageSrc={imageSrc}
        isEnableSaveImage={isVideoStopped}
        setImage={setImage}
        setUpdated={setUpdated}
        getVideoImage={getVideoImage}
      />
    ),
    [isVideoStopped]
  )

  return {
    EditImage: editImage,
    image: image,
    isUpdatedImage: updated,
  }
}
