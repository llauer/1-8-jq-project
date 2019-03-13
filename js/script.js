//iife to contain the array.
var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  //function to add items to the dom with jq.
  function addListItem(newPokemon) {
    var $ul = $('ul');
    var $li = $('<li></li>');
    $ul.append($li);

    //create buttons for li elements with jq.
    var $button = $('<button>' + newPokemon.name + '</button>');
    $li.append($button);

    // $button.innerText = newPokemon.name;
    // $button.textContent = newPokemon.name;

    // the mouse click needs to call the showDetails function
    $button.on('click', function(event) {
      showDetails(newPokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl)
      .then(function(response) {
        response.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          // //checking what is returned by
          // console.log(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(response) {
        console.log(response);
        item.imageUrl = response.sprites.front_default;
        item.height = response.height;
        item.weight = response.weight;
        // item.types = Object.keys(response.types);
        item.types = response.types[0].type.name;
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  //display modal with name height and image of the pokemon.

  var $modalContainer = $('#modal-container');

  function showModal(item) {
    // Clear all existing modal content
    // $modalContainer.innerHTML = '';

    // jquery clears the modal container from just adding items.
    $modalContainer.empty();

    // create div and add class modal
    var modal = $('<div class="modal"></div>');

    // Add the new modal content
    // create close button, add icon and classes
    var closeButtonElement = $('<button class="modal-close closeBtn">&times;</button>');
    // closeButtonElement.classList.add('modal-close', 'closeBtn');
    // closeButtonElement.innerHTML = '&times;';
    closeButtonElement.on('click', hideModal);

    var titleElement = $('<h1>' + item.name + '</h1>');
    // titleElement.innerText = item.name;

    //display image of the pokemon
    var imageElement = $('<img class="img-responsive" src=' + item.imageUrl + '>');
    // imageElement.setAttribute('src', item.imageUrl);

    var contentElement = $('<p>' + 'Height: ' + item.height + '</p>');
    // contentElement.innerText = 'Height: ' + item.height;
    var typeElement = $('<p>' + 'Type: ' + item.types + '</p>');
    // var contentElement1 = document.createElement('p');
    // contentElement.innerHTML = 'URL ' + detailsUrl;
    var weightElement = '<p>' + 'Weight: ' + item.weight + '</p>';

    modal.append(closeButtonElement);
    modal.append(titleElement);
    modal.append(contentElement);
    modal.append(weightElement);
    modal.append(typeElement);
    modal.append(imageElement);
    $modalContainer.append(modal);

    $modalContainer.addClass('is-visible');
  }
  // hide the modal changed to .removeClass
  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }

  // document.querySelector('#show-modal').addEventListener('click', () => {
  //   showModal('Modal title', 'This is the modal content!');
  // });

  //if the user presses the ESC key the modal will close. Changed to hasClass for jq.
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  //close the modal if the user clicks outside of the container.
  $modalContainer.on('click', e => {
    var target = e.target;
    if (target === $modalContainer[0]) {
      hideModal();
    }
  });

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      showModal(item);
    });
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    addListItem: addListItem,
    showModal: showModal,
    hideModal: hideModal
  };
})();

//load data with promise
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(currentPokemon) {
    pokemonRepository.addListItem(currentPokemon);
  });
});
