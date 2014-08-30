$lgrey: #fbfbfb
$dgrey: #202020

@mixin fade()
  background: -moz-linear-gradient(top, rgba(251,251,251,0) 0%, rgba(251,251,251,1) 100%)
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(251,251,251,0)), color-stop(100%,rgba(251,251,251,1)))
  background: -webkit-linear-gradient(top, rgba(251,251,251,0) 0%,rgba(251,251,251,1) 100%)
  background: -o-linear-gradient(top, rgba(251,251,251,0) 0%,rgba(251,251,251,1) 100%)
  background: -ms-linear-gradient(top, rgba(251,251,251,0) 0%,rgba(251,251,251,1) 100%)
  background: linear-gradient(to bottom, rgba(251,251,251,0) 0%,rgba(251,251,251,1) 100%)
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00fbfbfb', endColorstr='#fbfbfb',GradientType=0 )
  
@mixin scrollbar()
  overflow-y: scroll
  height: 100%
  &::-webkit-scrollbar
    width: 8px
    background-color: rgba(0,0,0,0)
    -webkit-border-radius: 100px
    &:hover
      background-color: rgba(0, 0, 0, 0.09)
    &:horizontal
      display: none
  &::-webkit-scrollbar-thumb
    &:vertical
      background: rgba(0,0,0,0.5)
      -webkit-border-radius: 100px
      &:active
        background: rgba(0,0,0,0.61)
        -webkit-border-radius: 100px

.light
  color: #555555
  background: $lgrey
  header
    background-color: $lgrey
  .divider
    border-color: #909090
  a
    color: #909090
    &:hover, &.activeLink
      color: $dgrey

.dark
  color: #909090
  background: $dgrey
  .divider
    border-color: #555555
  a
    color: #555555
    &:hover, &.activeLink
      color: $lgrey

html
  height: 100%
  overflow: hidden

body
  font-family: RalewayMedium, Helvetica, Ariel, sans-serif
  font-style: normal
  text-align: center
  font-size: 12px
  letter-spacing: 0.1em
  overflow: hidden
  margin: 0
  padding: 0
  position: absolute
  top: 15em
  left: 0
  bottom: 0
  right: 0

h1
  text-transform: uppercase
  font-family: RalewayThin
  font-weight: 100

h2
  text-transform: uppercase
  font-weight: normal

h3
  font-family: RalewayBold
  font-weight: Normal

a
  text-decoration: none
  position: relative
  z-index: 100
  .activeLink
    text-transform: uppercase
    font-family: RalewayBold
    font-weight: normal

p
  padding-bottom: 0.5em

header
  position: fixed
  top: 0
  z-index: 11
  height: 15em
  width: 100%
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26)
  h1
    white-space: nowrap
    font-size: 5em
    letter-spacing: 0.2em
    margin: 0.5em
  a
    display: inline-block
    margin: 0 auto 0 auto
    text-align: center
  ul
    text-transform: uppercase
    margin: 0 auto 0 auto
    display: table
    table-layout: fixed
    li
      text-align: center
      display: table-cell
      height: 1em
      padding: 1em
      overflow: hidden

.back
  position: absolute
  top: 0
  left: 0
  font-size: 3em
  padding: 0.5em
  
#contentDiv
  white-space: normal
  position: absolute
  width: 100vw

#content
  opacity: 1
  text-align: left
  white-space: nowrap
  overflow: hidden
  .gallery-expanded
    @extend #contentDiv
    height: 100%
    z-index: 5
    background:
      repeat: no-repeat
      position: center
      size: contain
  #blog
    @extend #contentDiv
    @include scrollbar()
    .blog-post
      width: 90%
      max-width: 80em
      margin:  1em auto 1em auto
      position: relative
      max-height: 17em
      transition: 0.5s
      transition-timing-function: cubic-bezier(0,1,0.5,1)
      overflow-y: hidden
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26)
      padding: 1em
      .fade
        position: absolute
        left: 0
        right: 0
        top: 15em
        width: 100%
        height: 4em
        transition: top 0.5s
        @include fade()
      .expander
        line-height: 1.5em
        font-size: 3em
        float: left
        transition: 0.5s
      &.expanded
        max-height: 500em
        transition-timing-function: ease-in
        .fade
          top: 498em
        .expander
          transform: rotate(90deg)
          color: #922
  .gallery
    @extend #contentDiv
    @include scrollbar()
    .tiles
      width: 90vw
      margin: auto
      .photo-container
        width: 28vw
        height: 28vw
        margin: 1vw
        float: left
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26)
        z-index: 1
        background: #fff
        overflow: hidden
        background-size: cover
        background-position: center
        &:nth-child(3n+1)
          clear: left
        &:nth-child(-n+3)
          margin-top: 0
        &:nth-last-child(-n+3)
          margin-bottom: 0
        a
          height: 100%
          width: 100%
          padding: 0
          margin: 0
          display: block

#footer
  position: absolute
  bottom: 10px
  width: 100%
  padding-bottom: 10px
  background: transparent
  text-align: center
  max-height: 70px
  #licence
    font-size: 8px
    text-align: right
    text-transform: none
    position: fixed
    bottom: 10px
    width: 100%
    right: 0
    z-index: 99
    background: transparent
    padding-right: 2px
