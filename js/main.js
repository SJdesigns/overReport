// ejemplos de usuarios
// SJalvarez99-2930
// dafran-21192
// Mákina#2282
// Poko#2323

var json = '';
var heroesQuick = [];
var heroesCompet = [];
var topHeroesHTML = '';
var categorySort = '';
var activeTab = {'id':'quick','jsonKey':'quickPlayStats'};
var lang;

// inicializamos el histórico de búsquedas
if (localStorage.getItem('ow-history')==null) {
	var owHistory = [];
	localStorage.setItem('ow-history','[]');
} else {
	var owHistory = JSON.parse(localStorage.getItem('ow-history'));
}

$(function() {
	// detectamos idioma del usuario
	if (localStorage.getItem('ow-lang')==null) {
		if (LangTexts[window.navigator.language]) { lang = window.navigator.language; }
		else { lang = 'en'; }
	} else {
		if (LangTexts[localStorage.getItem('ow-lang')]) { lang = localStorage.getItem('ow-lang'); }
		else { lang = 'en'; }
	}
	$('#chooseLangFlag').attr('src','img/flags/' + lang + '.svg');

	//json = JSON.parse(localStorage.getItem('ow'));
	$('#searchBoxSubmit').on('submit',function(e) {
		e.preventDefault();
		if ($('#searchBox').val()!='') {
			$('#loadingBack').show();
			$('#loadingBack .spinner').show();
			$('#headerPlayer').slideUp(0);
			$('nav').css('visibility','hidden');

			$('#searchBox').val($('#searchBox').val().replace('#','-'));
			if ($('#searchBox').val()) {
				$('#errorMessage').css('visibility','hidden');
				getJson('pc',$('#pickServer').val(),$('#searchBox').val());
			}
		}
	});

	if ($('#searchBox').val() == '') {
		$('#loadingBack .spinner').hide();
	} else {
		getJson('pc',$('#pickServer').val(),$('#searchBox').val());
	}

	$('#goToUp').hide();

	$('#goToUp').on('click',function() {
		$("html, body").animate({ scrollTop: 0 }, 500);
	});

	$(window).on('scroll',function() {
		if ($(window).scrollTop()>500) {
			$('#goToUp').fadeIn(200);
		} else {
			$('#goToUp').fadeOut(200);
		}
	});

	// mostrar sugerencias al realizar una búsqueda
	$('#searchBox').on('change keyup paste',function() {
		var addSuggests = '';
		for (i in owHistory) {
			addSuggests += '<div class="searchSuggestsItem">' + owHistory[i] + '</div>';
		}
		addSuggests += '<div style="clear:both"></div>';
		$('#searchSuggests').html(addSuggests);
		$('#searchSuggests').slideDown(200);

		$('.searchSuggestsItem').on('click',function() {
			$('#searchBox').val($(this).text());
			$('#searchBoxSubmit').submit();
			$('#searchBox').focus();
		});
	});

	applyLang();
});

function getJson(platform,server,userID) {
	// obtener los datos del usuario elegido
	$.get('https://ow-api.com/v1/stats/' + platform + '/' + server + '/' + userID + '/complete').done(function( data ) {
		console.log(JSON.parse(data));
		localStorage.setItem('ow',data);
		json = JSON.parse(localStorage.getItem('ow'));
		if (json.error=='The requested player was not found') {
			$('#loadingBack .spinner').hide();
			$('#errorMessage').text('No se ha encontrado el usuario');
			$('#errorMessage').css('visibility','visible');
		} else {
			loadPlayer();

			$('#loadingBack').fadeOut(200);
			$('#headerPlayer').slideDown(200);
			$('nav').css('visibility','visible');
			$('#searchSuggests').slideUp(100);

			if (owHistory.indexOf(userID)==-1) {
				owHistory.push(userID);
				localStorage.setItem('ow-history',JSON.stringify(owHistory));
			}
		}
	})
		.fail(function() {
		    alert( "No se ha encontrado el usuario" );
		});
}

function loadPlayer() {
	// player general data
	$('#playerIcon').attr('src',json.icon); // player icon
	$('#playerInfoLeft>h1').text(json.name); // player name
	$('#playerLevel div:first p').text(json.level); // player level
	$('#playerLevel div:nth-child(2) p').html('');

	// detectamos error de carga del logo de jugador
	$('#playerIcon').on('error',function() {
		$('#playerIcon').attr('src','img/defaultUser.jpg');
	});

	// cambio de color de nivel
	if (json.prestige<=5) {
		$('#playerLevel div:nth-child(1)').css({'background-color':'rgba(205,127,50,1)','color':'#fff'});
		var estrellasPrestigio = json.prestige;
	} else if (json.prestige>5 && json.prestige<=10) {
		$('#playerLevel div:nth-child(1)').css({'background-color':'rgba(185,185,185,1)','color':'#fff'});
		var estrellasPrestigio = json.prestige -5;
	} else if (json.prestige>10 && json.prestige<=15) {
		$('#playerLevel div:nth-child(1)').css({'background-color':'rgba(212,175,55,1)','color':'#fff'});
		var estrellasPrestigio = json.prestige -10;
	} else {
		$('#playerLevel div:nth-child(1)').css({'background-color':'rgba(229, 228, 226,1)','color':'#555'});
		var estrellasPrestigio = json.prestige -15;
	}

	for (i=0;i<estrellasPrestigio;i++) {
		$('#playerLevel div:nth-child(2) p').append('<img src="img/star.svg" />');
	}

	if ($('#playerLevel div:nth-child(2) p').html() == '') {
		$('#playerLevel div:nth-child(2)').hide();
	} else {
		$('#playerLevel div:nth-child(2)').show();
	}
	
	if (json.ratingName == 'Bronze') { $('#playerRank p:nth-child(2) img').attr('src','img/rankBronze.png'); }
	else if (json.ratingName == 'Silver') { $('#playerRank p:nth-child(2) img').attr('src','img/rankSilver.png'); }
	else if (json.ratingName == 'Gold') { $('#playerRank p:nth-child(2) img').attr('src','img/rankGold.png'); }
	else if (json.ratingName == 'Platinum') { $('#playerRank p:nth-child(2) img').attr('src','img/rankPlatinum.png'); }
	else if (json.ratingName == 'Diamond') { $('#playerRank p:nth-child(2) img').attr('src','img/rankDiamond.png'); }
	else if (json.ratingName == 'Master') { $('#playerRank p:nth-child(2) img').attr('src','img/rankMaster.png'); }
	else if (json.ratingName == 'Grandmaster') { $('#playerRank p:nth-child(2) img').attr('src','img/rankGrandmaster.png'); }
	else if (json.ratingName == 'Top500') { $('#playerRank p:nth-child(2) img').attr('src','img/rankTop500.png'); }
	else { $('#playerRank p:nth-child(2) img').attr('src',json.ratingIcon); }

	$('#playerRank p:nth-child(2) img').attr('title',json.ratingName);
	$('#playerRank p:nth-child(2) i').text(json.rating);

	if (json.ratingName == '') {
		$('#playerRank p:nth-child(1)').hide();
	} else {
		$('#playerRank p:nth-child(1)').show();
	}

	// loading heroes table
	loadData(activeTab.jsonKey);
	$('#heroesTop select').on('change',function() {
		loadHeroesList(activeTab.jsonKey);
	});
}

function loadHeroesList(mode) {
	heroesQuick = [];

	for (h in json[mode].careerStats) {
		if (h != 'allHeroes') {
			heroesQuick.push({
				'heroe':h,
				'timePlayed':checkValue(convertDate(json[mode].careerStats[h].game.timePlayed)),
				'gamesWon':checkValue(json[mode].careerStats[h].game.gamesWon),
				'weaponAccuracy':checkValue(json[mode].careerStats[h].combat.weaponAccuracy),
				'multiKillBest':checkValue(json[mode].topHeroes[h].multiKillBest),
				'objectiveKillsAvg':checkValue(json[mode].careerStats[h].average.objectiveKills),
				'eliminationsPerLife':checkValue(json[mode].careerStats[h].average.eliminationsPerLife),
				'bestKillStreak':checkValue(json[mode].careerStats[h].best.killsStreakBest),
				'damageHeroes':checkValue(json[mode].careerStats[h].best.allDamageDoneMostInGame),
				'totalEliminations':checkValue(json[mode].careerStats[h].combat.eliminations),
				'totalDeaths':checkValue(json[mode].careerStats[h].combat.deaths),
				'finalBlows':checkValue(json[mode].careerStats[h].combat.finalBlows),
			});
		}
	}

	heroesQuick.sort(function(a, b) {
		if ($('#heroesTop select').val() == 'timePlayed') { categorySort = 'timePlayed';	return parseFloat(b.timePlayed) - parseFloat(a.timePlayed);
		} else if ($('#heroesTop select').val() == 'gamesWon') { categorySort = 'gamesWon'; return parseFloat(b.gamesWon) - parseFloat(a.gamesWon);
		} else if ($('#heroesTop select').val() == 'killRatio') { categorySort = 'eliminationsPerLife'; return parseFloat(b.eliminationsPerLife) - parseFloat(a.eliminationsPerLife);
		} else if ($('#heroesTop select').val() == 'weaponAccuracy') { categorySort = 'weaponAccuracy'; return parseFloat(b.weaponAccuracy) - parseFloat(a.weaponAccuracy);
		} else if ($('#heroesTop select').val() == 'multikill') { categorySort = 'multiKillBest'; return parseFloat(b.multiKillBest) - parseFloat(a.multiKillBest);
		} else if ($('#heroesTop select').val() == 'bestKillStreak') { categorySort = 'bestKillStreak'; return parseFloat(b.bestKillStreak) - parseFloat(a.bestKillStreak);
		} else if ($('#heroesTop select').val() == 'damageHeroes') { categorySort = 'damageHeroes'; return parseFloat(b.damageHeroes) - parseFloat(a.damageHeroes);
		} else if ($('#heroesTop select').val() == 'totalEliminations') { categorySort = 'totalEliminations'; return parseFloat(b.totalEliminations) - parseFloat(a.totalEliminations);
		} else if ($('#heroesTop select').val() == 'totalDeaths') { categorySort = 'totalDeaths'; return parseFloat(b.totalDeaths) - parseFloat(a.totalDeaths);
		} else if ($('#heroesTop select').val() == 'finalBlows') { categorySort = 'finalBlows'; return parseFloat(b.finalBlows) - parseFloat(a.finalBlows);
		} else { categorySort = 'timePlayed'; return parseFloat(b.timePlayed) - parseFloat(a.timePlayed);
		}
	});

	$('#heroesList').html('');
	for (x in heroesQuick) {
		topHeroesHTML = '<div class="heroeData"><img src="img/' + heroesQuick[x].heroe + '.png" /><div class="heroeBar"><div>';
		topHeroesHTML += '<span style="width:' + (parseFloat(heroesQuick[x][categorySort])*100)/parseFloat(heroesQuick[0][categorySort]) + '%"></span>';
		if ($('#heroesTop select').val() == 'timePlayed') {
			if (heroesQuick[x].timePlayed>=60) {
				topHeroesHTML += '<p>' + heroesQuick[x].heroe + '<i>' + (heroesQuick[x][categorySort])/60 + ' h</i></p></div></div></div>';
			} else {
				topHeroesHTML += '<p>' + heroesQuick[x].heroe + '<i>' + heroesQuick[x][categorySort] + ' min</i></p></div></div></div>';
			}
		} else {
			if (isNaN(heroesQuick[x][categorySort])==true) {
				if (heroesQuick[x][categorySort].slice(-1)=='%') {
					topHeroesHTML += '<p>' + heroesQuick[x].heroe + '<i>' +  roundNumber(parseInt(heroesQuick[x][categorySort]),2) + ' %</i></p></div></div></div>';
				} else {
					topHeroesHTML += '<p>' + heroesQuick[x].heroe + '<i>' +  roundNumber(heroesQuick[x][categorySort],2) + '</i></p></div></div></div>';
				}
			} else {
				topHeroesHTML += '<p>' + heroesQuick[x].heroe + '<i>' +  roundNumber(heroesQuick[x][categorySort],2) + '</i></p></div></div></div>';
			}
		}
		$('#heroesList').append(topHeroesHTML);
	}

	$('.heroeData').on('click',function() {
		var nombreHeroe = $(this).find('.heroeBar').find('div').find('p').html();
		var nombreHeroe = nombreHeroe.substring(0,nombreHeroe.indexOf('<i>'));
		console.log(nombreHeroe);
		$('html, body').animate({scrollTop:$('#heroeDetail'+nombreHeroe).offset().top},600,'linear');
		$('#heroeDetail'+nombreHeroe).find('.heroeDetailCenter').slideDown(300);
		$('#heroeDetail'+nombreHeroe).find('.desplDetail').attr('src','img/up.svg');
	});
}

function loadData(mode) {
	$('#playerVictories i').text(json[mode].games.won);
	if (convertDate(json[mode].careerStats.allHeroes.game.timePlayed)>=60) {
		$('#playerTimePlayed i').text((convertDate(json[mode].careerStats.allHeroes.game.timePlayed))/60 + ' h');
	} else {
		$('#playerTimePlayed i').text(convertDate(json[mode].careerStats.allHeroes.game.timePlayed) + ' min');
	}

	loadHeroesList(mode);

	// medallas
	$('#goldMedals').text(json[mode].awards.medalsGold.toLocaleString());
	$('#silverMedals').text(json[mode].awards.medalsSilver.toLocaleString());
	$('#bronzeMedals').text(json[mode].awards.medalsBronze.toLocaleString());

	// datos totales
	$('#totalDataKills').text(checkValue(json[mode].careerStats.allHeroes.combat.eliminations).toLocaleString());
	$('#totalDataHeroeDamage').text(checkValue(json[mode].careerStats.allHeroes.combat.heroDamageDone).toLocaleString());
	$('#totalDataObjectiveTime').text(checkValue(json[mode].careerStats.allHeroes.combat.objectiveTime));
	$('#totalDataDeaths').text(checkValue(json[mode].careerStats.allHeroes.combat.deaths).toLocaleString());
	$('#totalDataBarrierDamage').text(checkValue(json[mode].careerStats.allHeroes.combat.barrierDamageDone).toLocaleString());
	$('#totalDataObjectiveKills').text(checkValue(json[mode].careerStats.allHeroes.combat.objectiveKills).toLocaleString());
	$('#totalDataFinalBlows').text(checkValue(json[mode].careerStats.allHeroes.combat.finalBlows).toLocaleString());
	$('#totalDataSoloKills').text(checkValue(json[mode].careerStats.allHeroes.combat.soloKills).toLocaleString());
	$('#totalDataOnFire').text(checkValue(json[mode].careerStats.allHeroes.combat.timeSpentOnFire));
	$('#totalDataHealing').text(checkValue(json[mode].careerStats.allHeroes.assists.healingDone).toLocaleString());
	$('#totalDataOfAssists').text(checkValue(json[mode].careerStats.allHeroes.assists.offensiveAssists).toLocaleString());
	$('#totalDataEnvironmentalKills').text(checkValue(json[mode].careerStats.allHeroes.combat.environmentalKills).toLocaleString());

	// mejores datos por partida
	$('#recordStatsKills').text(checkValue(json[mode].careerStats.allHeroes.best.eliminationsMostInGame).toLocaleString());
	$('#recordStatsHeroeDamage').text(checkValue(json[mode].careerStats.allHeroes.best.heroDamageDoneMostInGame).toLocaleString());
	$('#recordStatsObjectiveTime').text(checkValue(json[mode].careerStats.allHeroes.best.objectiveTimeMostInGame));
	$('#recordStatsKillStreak').text(checkValue(json[mode].careerStats.allHeroes.best.killsStreakBest).toLocaleString());
	$('#recordStatsBarrierDamage').text(checkValue(json[mode].careerStats.allHeroes.best.barrierDamageDoneMostInGame).toLocaleString());
	$('#recordStatsObjectiveKills').text(checkValue(json[mode].careerStats.allHeroes.best.objectiveKillsMostInGame).toLocaleString());
	$('#recordStatsFinalBlows').text(checkValue(json[mode].careerStats.allHeroes.best.meleeFinalBlowsMostInGame).toLocaleString());
	$('#recordStatsSoloKills').text(checkValue(json[mode].careerStats.allHeroes.best.soloKillsMostInGame).toLocaleString());
	$('#recordStatsOnFire').text(checkValue(json[mode].careerStats.allHeroes.best.timeSpentOnFireMostInGame));
	$('#recordStatsHealing').text(checkValue(json[mode].careerStats.allHeroes.best.healingDoneMostInGame).toLocaleString());
	$('#recordStatsOfAssists').text(checkValue(json[mode].careerStats.allHeroes.best.defensiveAssistsMostInGame).toLocaleString());
	$('#recordStatsDefAssists').text(checkValue(json[mode].careerStats.allHeroes.best.offensiveAssistsMostInGame).toLocaleString());

	detailHeroes = '';
	for (i in json[mode].careerStats) {
		if (i!='allHeroes') {
			detailHeroes += '<div class="heroeDetail" id="heroeDetail' + i + '"><div class="heroeDetailTop"><div>';
			detailHeroes += '<img class="heroeDetailImg" src="img/' + i + '.png" /><h3>' + i + '</h3></div><div><img class="desplDetail" id="desplDetail' + i + '" src="img/down.svg" /></div></div>';
			detailHeroes += '<div class="heroeDetailCenter">';
			for (j in json[mode].careerStats[i]) {
				detailHeroes += '<div><h4>' + j + '</h4>';
				for (k in json[mode].careerStats[i][j]) {
					detailHeroes += '<p>' + k + ' : <i>' + json[mode].careerStats[i][j][k] + '</i></p>';
				}
				detailHeroes += '</div>';
			}
			detailHeroes += '</div></div>';
		}
	}
	$('#heroesDetailSection').html(detailHeroes);

	$('.heroeDetailTop').on('click',function() {
		if ($(this).parent().find('.heroeDetailCenter').css('display') == 'none') {
			$(this).parent().find('.heroeDetailCenter').slideDown(300);
			$(this).find('.desplDetail').attr('src','img/up.svg');
		} else {
			$(this).parent().find('.heroeDetailCenter').slideUp(300);
			$(this).find('.desplDetail').attr('src','img/down.svg');
		}
	});
}

function applyLang() {
	// aplicamos idioma del usuario en los textos
	$('#searchBox').attr('placeholder',LangTexts[lang]['userID']);
	$('#navQuick').text(LangTexts[lang]['QuickPlay']);
	$('#navRanked').text(LangTexts[lang]['Ranked']);
	$('#playerRank p:first').text(LangTexts[lang]['ActualRanking']);
	$('#playerVictories p:first').text(LangTexts[lang]['Victories']);
	$('#playerTimePlayed p:first').text(LangTexts[lang]['TimePlayed']);
	$('#titleMedals').text(LangTexts[lang]['Medals']);
	$('#titleGeneralData').text(LangTexts[lang]['GeneralData']);
	$('#titleHeroes').text(LangTexts[lang]['Heroes']);
	$('#titleBestGameResults').text(LangTexts[lang]['BestGameResults']);
	$('#heroesDetailTitle').text(LangTexts[lang]['AllDataHeroe']);

	$('#heroesTop select option:nth-child(1)').text(LangTexts[lang]['TimePlayed']);
	$('#heroesTop select option:nth-child(2)').text(LangTexts[lang]['WinedGames']);
	$('#heroesTop select option:nth-child(3)').text(LangTexts[lang]['Elims.Proportion']);
	$('#heroesTop select option:nth-child(4)').text(LangTexts[lang]['Accuracy']);
	$('#heroesTop select option:nth-child(5)').text(LangTexts[lang]['BestMultikill']);
	$('#heroesTop select option:nth-child(6)').text(LangTexts[lang]['BestKillStrike']);
	$('#heroesTop select option:nth-child(7)').text(LangTexts[lang]['Max.HeroeDamage']);
	$('#heroesTop select option:nth-child(8)').text(LangTexts[lang]['TotalEliminations']);
	$('#heroesTop select option:nth-child(9)').text(LangTexts[lang]['TotalDeaths']);
	$('#heroesTop select option:nth-child(10)').text(LangTexts[lang]['FinalBlows']);

	$('#totalDataKills,#recordStatsKills').parent().find('h4').text(LangTexts[lang]['Eliminations']);
	$('#totalDataHeroeDamage,#recordStatsHeroeDamage').parent().find('h4').text(LangTexts[lang]['HeroeDamage']);
	$('#totalDataObjectiveTime,#recordStatsObjectiveTime').parent().find('h4').text(LangTexts[lang]['ObjectiveTime']);
	$('#totalDataDeaths').parent().find('h4').text(LangTexts[lang]['Deaths']);
	$('#totalDataBarrierDamage,#recordStatsBarrierDamage').parent().find('h4').text(LangTexts[lang]['BarrierDamage']);
	$('#totalDataObjectiveKills,#recordStatsObjectiveKills').parent().find('h4').text(LangTexts[lang]['Object.Kills']);
	$('#totalDataFinalBlows,#recordStatsFinalBlows').parent().find('h4').text(LangTexts[lang]['FinalBlows']);
	$('#totalDataSoloKills,#recordStatsSoloKills').parent().find('h4').text(LangTexts[lang]['SoloElims.']);
	$('#totalDataOnFire,#recordStatsOnFire').parent().find('h4').text(LangTexts[lang]['OnFireTime']);
	$('#totalDataHealing,#recordStatsHealing').parent().find('h4').text(LangTexts[lang]['Healing']);
	$('#totalDataOfAssists,#recordStatsOfAssists').parent().find('h4').text(LangTexts[lang]['Off.Asists']);
	$('#totalDataEnvironmentalKills').parent().find('h4').text(LangTexts[lang]['EnviromentKills']);
	$('#recordStatsKillStreak').parent().find('h4').text(LangTexts[lang]['KillStrike']);
	$('#recordStatsDefAssists').parent().find('h4').text(LangTexts[lang]['DefensiveAssists']);
}

// permite al usuario cambiar de idioma manualmente
function changeLang(l) {
	lang = l;
	localStorage.setItem('ow-lang',l);
	$('#chooseLangFlag').attr('src','img/flags/' + lang + '.svg');
	applyLang();
}

function roundNumber(num, scale) {
  	if(!("" + num).includes("e")) {
    	return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  	} else {
	    var arr = ("" + num).split("e");
	    var sig = ""
	    if(+arr[1] + scale > 0) {
	    	sig = "+";
	    }
	    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
	}
}

function checkValue(data) {
	if (data == undefined) {
		result = 0;
	} else {
		result = data;
	}
	return result;
}

function convertDate(date) {
	if (date.includes('hour')) {
		return parseInt(date.substring(0,date.search(' ')))*60;
	} else if (date.includes('minute')) {
		return parseInt(date.substring(0,date.search(' ')));
	} else {
		return 0;
	}
}

function changeTab(id) {
	if (id=='quick') {
		$('#navQuick').addClass('navOptionActive');
		$('#navRanked').removeClass('navOptionActive');
		activeTab = {'id':'quick','jsonKey':'quickPlayStats'};
		loadData('quickPlayStats');
	} else if (id=='ranked') {
		$('#navQuick').removeClass('navOptionActive');
		$('#navRanked').addClass('navOptionActive');
		activeTab = {'id':'ranked','jsonKey':'competitiveStats'};
		loadData('competitiveStats');
	}
}