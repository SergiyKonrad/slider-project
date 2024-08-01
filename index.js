class Slider {
  constructor(sliderId, config) {
    this.slider = document.getElementById(sliderId)
    this.slides = this.slider.querySelectorAll('.slide')
    this.totalSlides = this.slides.length
    this.currentIndex = 0
    this.autoSlideInterval = null
    this.autoSlideDuration = config.autoSlideDuration || 3000
    this.showIndicators =
      config.showIndicators !== undefined ? config.showIndicators : true
    this.isPaused = false

    this.touchStartX = null
    this.mouseStartX = null

    this.init()
  }

  init() {
    this.createControls()
    if (this.showIndicators) this.createIndicators()
    this.updateSlider()
    this.startAutoSlide()
    this.addEventListeners()
  }

  createControls() {
    const controlsContainer = document.createElement('div')
    controlsContainer.className = 'controls'

    const prevButton = document.createElement('button')
    prevButton.id = 'prev'
    prevButton.textContent = 'Prev'
    controlsContainer.appendChild(prevButton)

    const pauseResumeButton = document.createElement('button')
    pauseResumeButton.id = 'pause-resume'
    pauseResumeButton.textContent = 'Pause'
    controlsContainer.appendChild(pauseResumeButton)

    const nextButton = document.createElement('button')
    nextButton.id = 'next'
    nextButton.textContent = 'Next'
    controlsContainer.appendChild(nextButton)

    this.slider.appendChild(controlsContainer)
  }

  createIndicators() {
    const indicatorsContainer = document.createElement('div')
    indicatorsContainer.className = 'indicators'
    indicatorsContainer.id = 'indicators'

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('button')
      indicator.addEventListener('click', () => this.goToSlide(i))
      indicatorsContainer.appendChild(indicator)
    }

    this.slider.appendChild(indicatorsContainer)
  }

  updateSlider() {
    const slidesContainer = this.slider.querySelector('.slides')
    slidesContainer.style.transform = `translateX(-${this.currentIndex * 100}%)`
    if (this.showIndicators) this.updateIndicators()
  }

  updateIndicators() {
    const indicators = this.slider.querySelectorAll('#indicators button')
    indicators.forEach((indicator, index) => {
      indicator.style.backgroundColor =
        index === this.currentIndex ? 'black' : 'white'
    })
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides
    this.updateSlider()
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.totalSlides) % this.totalSlides
    this.updateSlider()
  }

  goToSlide(index) {
    this.currentIndex = index
    this.updateSlider()
  }

  startAutoSlide() {
    this.stopAutoSlide()
    this.autoSlideInterval = setInterval(
      () => this.nextSlide(),
      this.autoSlideDuration,
    )
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideInterval)
  }

  togglePauseResume() {
    const pauseResumeButton = document.getElementById('pause-resume')
    if (this.isPaused) {
      this.startAutoSlide()
      pauseResumeButton.textContent = 'Pause'
    } else {
      this.stopAutoSlide()
      pauseResumeButton.textContent = 'Resume'
    }
    this.isPaused = !this.isPaused
  }

  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX
  }

  handleTouchMove(event) {
    if (!this.touchStartX) return
    const touchEndX = event.touches[0].clientX
    if (this.touchStartX - touchEndX > 50) {
      this.nextSlide()
      this.touchStartX = null
    } else if (this.touchStartX - touchEndX < -50) {
      this.prevSlide()
      this.touchStartX = null
    }
  }

  handleMouseDown(event) {
    this.mouseStartX = event.clientX
  }

  handleMouseMove(event) {
    if (!this.mouseStartX) return
    const mouseEndX = event.clientX
    if (this.mouseStartX - mouseEndX > 50) {
      this.nextSlide()
      this.mouseStartX = null
    } else if (this.mouseStartX - mouseEndX < -50) {
      this.prevSlide()
      this.mouseStartX = null
    }
  }

  addEventListeners() {
    document
      .getElementById('next')
      .addEventListener('click', () => this.nextSlide())
    document
      .getElementById('prev')
      .addEventListener('click', () => this.prevSlide())
    document
      .getElementById('pause-resume')
      .addEventListener('click', () => this.togglePauseResume())

    this.slider.addEventListener('mouseenter', () => this.stopAutoSlide())
    this.slider.addEventListener('mouseleave', () => this.startAutoSlide())

    this.slider.addEventListener('touchstart', (event) =>
      this.handleTouchStart(event),
    )
    this.slider.addEventListener('touchmove', (event) =>
      this.handleTouchMove(event),
    )

    this.slider.addEventListener('mousedown', (event) =>
      this.handleMouseDown(event),
    )
    this.slider.addEventListener('mousemove', (event) =>
      this.handleMouseMove(event),
    )
    this.slider.addEventListener('mouseup', () => (this.mouseStartX = null))

    this.slider.addEventListener('dragstart', (event) => event.preventDefault())
  }
}

// Initialize the all the slider
document.addEventListener('DOMContentLoaded', () => {
  new Slider('slider', { autoSlideDuration: 3000, showIndicators: true })
})
