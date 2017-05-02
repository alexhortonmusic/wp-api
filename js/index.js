console.log('hey')

let rest_url

$('#new_url').submit(function(e) {
  // don't reload
  e.preventDefault()

  // get url
  let raw_url = $('input[name=raw_url]').val()

  // check if string is a proper URL
  try {
    $('.error').remove()
    let clean_url = (new URL(raw_url)).protocol + '//' + (new URL(raw_url)).hostname
    rest_url = clean_url + '/wp-json/wp/v2/'

    // get posts from new URL
    get_post_list()
  }

  catch (e) {
    $('.site-header').append(`<div class="error">That didn&rsquo;t work. Try a different url.</div>`)
    console.log('Error: User input is incorrect.')
  }
})

function get_post_list() {

  let json_url = rest_url + 'posts/'

  $.ajax({
    dataType: 'json',
    url: json_url
  })
  .done(function(obj) {
    create_post_list(obj)
  })
  .fail(function() {
    $('.site-header').append(`<div class="error">That didn&rsquo;t work. Try a different url.</div>`)
    console.log('Error: AJAX returned nothing.')
  })
}

function create_post_list(obj) {
  $('.post-list').empty().append(`<ul></ul>`)
  let navListItem

  for ( let i = 0; i < obj.length; i++ ) {
    navListItem =
    `
      <li class='post-links'>
        <a href='javascript:void(0)' data-id='${obj[i].id}'>
          ${obj[i].title.rendered}
        </a>
      </li>
    `
    $('.post-list ul').append(navListItem)
  }

  post_trigger()
}

function post_trigger() {
  // grabs clicked post id and gets object
  $('.post-links a').on('click', get_post)
  // auto "clicks" on most recent post
  $('.post-links a').first().trigger('click')
}

function get_post() {
  let post_id = $(this).attr('data-id')
  console.log(post_id)

  // create request
  let json_url = rest_url + 'posts/' + post_id + '?_embed=true'

  $.ajax({
    dataType: 'json',
    url: json_url
  })
  .done(function(obj) {
    // get post data
    the_post_data(obj)
  })
  .fail(function() {
    $('.site-header').append(`<div class="error">That didn&rsquo;t work. Try a different url.</div>`)
    console.log('Error: Single post error.')
  })
}

function the_post_data(obj) {
  // get featured img
  let featured_img_ID = obj.featured_media

  let feat_img

  build_post()

  // create html for post
  function output_the_img() {
    let img = obj._embedded['wp:featuredmedia'][0]
    let img_large = ''
    let img_width = img.media_details.sizes.full.width
    let img_height = img.media_details.sizes.full.height
    if (img.media_details.sizes.hasOwnProperty('large')) {
      img_large = img.media_details.sizes.large.source_url + '1024w'
    }
    feat_img =
    `
      <div class='featured-img'>
        <img src='${img.media_details.sizes.full.source_url}' width='${img_width}' height='${img_height}' class='the-featured-img' alt='' sizes='100vw' />
      </div>
    `
    return feat_img
  }

  function build_post() {
    let date = new Date(obj.date)
    if (featured_img_ID !== 0) {
      if ($('.featured-img').length) {
        $('.featured-img').replaceWith(output_the_img())
      } else {
        $('.post').before(output_the_img())
      }
    } else {
      $('.featured-img').remove()
    }
    $('.post-title').text(obj.title.rendered)
    $('.post-author').text(obj._embedded.author[0].name)
    $('.post-date').text(date.toDateString())
    $('.post-content').replaceWith(`<div class='post-content'>${obj.content.rendered}</div>`)
  }
}
