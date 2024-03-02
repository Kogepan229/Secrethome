export const createOptions = (): { value: string; name: string }[] => {
  return [
    {
      value: '',
      name: 'Select Room Type',
    },
    {
      value: 'video',
      name: 'Video',
    },
    {
      value: 'manga',
      name: 'Manga',
    },
  ]
}
