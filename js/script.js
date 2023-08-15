"use strict"

window.addEventListener("load", windowLoad)

function windowLoad() {
  // document.addEventListener("click", documentActions)

  // ------------- Slider SWIPER -------------
  if (document.querySelector(".hero__slider")) {
    const swiper = new Swiper(".hero__slider", {
      speed: 1500,
      loop: true,
      autoplay: {
        delay: 3000,
      },
      effect: "fade",
      pagination: {
        clickable: true,
        el: ".hero__pagination",
      },
    })
  }
  // ------------- END OF Slider SWIPER -------------

  // ------------- tabs function -------------
  const tabExist = document.querySelector(".nav-choose")

  if (tabExist) {
    tabExist.addEventListener("click", documentActions)
  }

  function documentActions(e) {
    const targetElement = e.target

    if (targetElement.closest(".nav-choose__cat")) {
      const tabNavItem = targetElement.closest(".nav-choose__cat")
      if (!tabNavItem.classList.contains("_active")) {
        const activeTabNavItem = document.querySelector(
          ".nav-choose__cat._active"
        )
        activeTabNavItem.classList.remove("_active")
        tabNavItem.classList.add("_active")

        const tabItems = document.querySelectorAll(".choose__tab")
        const activeTabItem = document.querySelector(".choose__tab._active")

        activeTabItem.classList.remove("_active")
        tabItems[getIndex(tabNavItem)].classList.add("_active")
      }
    }
  }

  function getIndex(el) {
    return Array.from(el.parentNode.children).indexOf(el)
  }
  // ------------- END OF tabs function -------------

  // ------------- hamburger menu -------------
  const iconMenu = document.querySelector(".icon-menu")
  const menuBody = document.querySelector(".menu__body")
  if (iconMenu) {
    iconMenu.addEventListener("click", function (e) {
      document.body.classList.toggle("body--lock")
      iconMenu.classList.toggle("_active")
      menuBody.classList.toggle("_active")
    })
  }
  // ------------- END OF hamburger menu -------------

  // ------------- shrinking header on scroll -------------
  // Get the header element
  const headerElement = document.querySelector(".header")

  // Define the callback function for the IntersectionObserver
  const callback = function (entries, observer) {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove("header--scrolled")
    } else {
      headerElement.classList.add("header--scrolled")
    }
  }
  // Create an IntersectionObserver instance with the callback function
  const headerObserver = new IntersectionObserver(callback)

  // Error handling in case the header element is not found
  if (headerElement) {
    // Observe the header element for changes
    headerObserver.observe(headerElement)
  } else {
    console.error("Header element not found.")
  }
  // ------------- END OF shrinking header on scroll -------------

  // ------------- Spoilers -------------
  const spoilersArray = document.querySelectorAll("[data-spoilers]")
  if (spoilersArray.length > 0) {
    const spoilersRegular = Array.from(spoilersArray).filter(function (
      item,
      index,
      self
    ) {
      return !item.dataset.spoilers.split(",")[0]
    })

    if (spoilersRegular.length > 0) {
      initSpoilers(spoilersRegular)
    }

    const spoilersMedia = Array.from(spoilersArray).filter(function (
      item,
      index,
      self
    ) {
      return item.dataset.spoilers.split(",")[0]
    })

    if (spoilersMedia.length > 0) {
      const breakpointsArray = []
      spoilersMedia.forEach((item) => {
        const params = item.dataset.spoilers
        const breakpoint = {}
        const paramsArray = params.split(",")
        breakpoint.value = paramsArray[0]
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
        breakpoint.item = item
        breakpointsArray.push(breakpoint)
      })

      let mediaQueries = breakpointsArray.map(function (item) {
        return (
          "(" +
          item.type +
          "-width: " +
          item.value +
          "px)," +
          item.value +
          "," +
          item.type
        )
      })
      mediaQueries = mediaQueries.filter(function (item, index, self) {
        return self.indexOf(item) === index
      })

      mediaQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",")
        const mediaBreakpoint = paramsArray[1]
        const mediaType = paramsArray[2]
        const matchMedia = window.matchMedia(paramsArray[0])

        const spoilersArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true
          }
        })

        matchMedia.addListener(function () {
          initSpoilers(spoilersArray, matchMedia)
        })
        initSpoilers(spoilersArray, matchMedia)
      })
    }

    function initSpoilers(spoilersArray, matchMedia = false) {
      spoilersArray.forEach((spoilersBlock) => {
        spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock
        if (matchMedia.matches || !matchMedia) {
          spoilersBlock.classList.add("_init")
          initSpoilerBody(spoilersBlock)
          spoilersBlock.addEventListener("click", setSpoilerAction)
        } else {
          spoilersBlock.classList.remove("_init")
          initSpoilerBody(spoilersBlock, false)
          spoilersBlock.removeEventListener("click", setSpoilerAction)
        }
      })
    }

    function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
      const spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]")
      if (spoilerTitles.length > 0) {
        spoilerTitles.forEach((spoilerTitle) => {
          if (hideSpoilerBody) {
            spoilerTitle.removeAttribute("tabindex")
            if (!spoilerTitle.classList.contains("_active")) {
              spoilerTitle.nextElementSibling.hidden = true
            }
          } else {
            spoilerTitle.setAttribute("tabindex", "-1")
            spoilerTitle.nextElementSibling.hidden = false
          }
        })
      }
    }
    function setSpoilerAction(e) {
      const el = e.target
      if (el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
        const spoilerTitle = el.hasAttribute("data-spoiler")
          ? el
          : el.closest("[data-spoiler]")
        const spoilersBlock = spoilerTitle.closest("[data-spoilers]")
        const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler")
          ? true
          : false
        if (!spoilersBlock.querySelectorAll("._slide").length) {
          if (oneSpoiler && !spoilerTitle.classList.contains("_active")) {
            hideSpoilersBody(spoilersBlock)
          }
          spoilerTitle.classList.toggle("_active")
          _slideToggle(spoilerTitle.nextElementSibling, 300)
        }
        e.preventDefault()
      }
    }
    function hideSpoilersBody(spoilersBlock) {
      const spoilerActiveTitle = spoilersBlock.querySelector(
        "[data-spoiler]._active"
      )
      if (spoilerActiveTitle) {
        spoilerActiveTitle.classList.remove("_active")
        _slideUp(spoilerActiveTitle.nextElementSibling, 300)
      }
    }
  }
  //SlideToggle
  let _slideUp = (target, duration = 300) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide")
      target.style.transitionProperty = "height, margin, padding"
      target.style.transitionDuration = duration + "ms"
      target.style.height = target.offsetHeight + "px"
      target.offsetHeight
      target.style.overflow = "hidden"
      target.style.height = 0
      target.style.paddingTop = 0
      target.style.paddingBottom = 0
      target.style.marginTop = 0
      target.style.marginBottom = 0
      window.setTimeout(() => {
        target.hidden = true
        target.style.removeProperty("height")
        target.style.removeProperty("padding-top")
        target.style.removeProperty("padding-bottom")
        target.style.removeProperty("margin-top")
        target.style.removeProperty("margin-bottom")
        target.style.removeProperty("overflow")
        target.style.removeProperty("transition-duration")
        target.style.removeProperty("transition-property")
        target.classList.remove("_slide")
      }, duration)
    }
  }
  let _slideDown = (target, duration = 300) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide")
      if (target.hidden) {
        target.hidden = false
      }
      let height = target.offsetHeight
      target.style.overflow = "hidden"
      target.style.height = 0
      target.style.paddingTop = 0
      target.style.paddingBottom = 0
      target.style.marginTop = 0
      target.style.marginBottom = 0
      target.offsetHeight
      target.style.transitionProperty = "height, margin, padding"
      target.style.transitionDuration = duration + "ms"
      target.style.height = height + "px"
      target.style.removeProperty("padding-top")
      target.style.removeProperty("padding-bottom")
      target.style.removeProperty("margin-top")
      target.style.removeProperty("margin-bottom")
      window.setTimeout(() => {
        target.style.removeProperty("height")
        target.style.removeProperty("overflow")
        target.style.removeProperty("transition-duration")
        target.style.removeProperty("transition-property")
        target.classList.remove("_slide")
      }, duration)
    }
  }
  let _slideToggle = (target, duration = 300) => {
    if (target.hidden) {
      return _slideDown(target, duration)
    } else {
      return _slideUp(target, duration)
    }
  }
  // ------------- END OF Spoilers -------------
}
