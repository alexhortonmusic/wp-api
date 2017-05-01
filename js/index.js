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
    console.log(rest_url)
  }

  catch (e) {
    $('.site-header').append(`<div class="error">That didn&rsquo;t work. Try a different url.</div>`)
    console.log('Error: User input is incorrect.')
  }
})
