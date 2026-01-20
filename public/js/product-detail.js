const mainImage = document.getElementById('current-image')
const images = document.getElementsByClassName('product-image')
const imagesArr = Array.from(images)
imagesArr[0].classList.add('border', 'border-secondary')
imagesArr.forEach(image => {
  image.onclick = () => {
    const src = image.getAttribute('src')
    if (!image.classList.contains('border')) {
      imagesArr.forEach(arrImage => arrImage.classList.remove('border', 'border-secondary'))
      image.classList.add('border', 'border-secondary')
    }
    mainImage.setAttribute('src', src)
  }
})