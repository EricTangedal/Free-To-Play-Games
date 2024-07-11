// scripts.js
$(document).ready(function() {
    const gamesList = $('#games-list');
    const pagination = $('.pagination');
    const searchInput = $('#search');
    const genreSelect = $('#genre');
    const platformSelect = $('#platform');
    let currentPage = 1;
    let perPage = 10;

    function fetchGames() {
        gamesList.html('<div class="loading-spinner">Loading...</div>');
        $.ajax({
            url: '/api/games',
            data: {
                search: searchInput.val(),
                genre: genreSelect.val(),
                platform: platformSelect.val(),
                page: currentPage,
                per_page: perPage
            },
            success: function(data) {
                gamesList.empty();
                data.games.forEach(game => {
                    const gameCard = `
                        <div class="col-md-4 game-card">
                            <div class="card">
                                <img src="${game.thumbnail}" class="card-img-top game-thumbnail" alt="${game.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${game.title}</h5>
                                    <p class="card-text">${game.short_description}</p>
                                    <p class="card-text"><small class="text-muted">${game.genre} | ${game.platform}</small></p>
                                    <a href="${game.game_url}" class="btn btn-primary" target="_blank">Play Now</a>
                                </div>
                            </div>
                        </div>
                    `;
                    gamesList.append(gameCard);
                });

                updatePagination(data.page, data.total, data.per_page);
            }
        });
    }

    function updatePagination(page, total, perPage) {
        pagination.empty();
        const totalPages = Math.ceil(total / perPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = `<li class="page-item ${i === page ? 'active' : ''}">
                                <a class="page-link" href="#">${i}</a>
                              </li>`;
            pagination.append(pageItem);
        }

        $('.page-link').click(function(e) {
            e.preventDefault();
            currentPage = parseInt($(this).text());
            fetchGames();
        });
    }

    function populateFilters() {
        $.ajax({
            url: '/api/games',
            success: function(data) {
                const genres = [...new Set(data.games.map(game => game.genre))];
                const platforms = [...new Set(data.games.map(game => game.platform))];

                genres.forEach(genre => {
                    genreSelect.append(`<option value="${genre}">${genre}</option>`);
                });

                platforms.forEach(platform => {
                    platformSelect.append(`<option value="${platform}">${platform}</option>`);
                });
            }
        });
    }

    searchInput.keyup(fetchGames);
    genreSelect.change(fetchGames);
    platformSelect.change(fetchGames);

    populateFilters();
    fetchGames();
});
