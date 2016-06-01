---
title: Visualising London
tags: []
---

I recently started working on a couple of interesting data-visualisation projects at work, which lead me to researching visualisation libraries, watching [this video](https://www.youtube.com/watch?v=Mucmb33711A), and thinking that it would be cool to do something like that for London.

Happily, [london.data.gov](https://london.data.gov) exists and has a bizarrely good selection of datasets, so I threw together the following visualisation tool to provide a little window into the state of London, ward-by-ward.

<div id="london-vis">
  <link rel="stylesheet" href="/res/london-vis/london-vis.css" />
  <script src="/res/js/d3/d3.min.js"></script>
  <script src="/res/js/sql/sql.js"></script>
  <script src="/res/london-vis/vis.js"></script>
  <div class='overlay' onclick='londonvis()'>
    <span class='clickme'>Click to load</span>
  </div>
    <svg width="720" height="640">
      <circle class="datum" r="5.250786476394719" style="fill: rgb(31, 119, 180);" cx="511.0612939079826" cy="280.2089900636233"><title>Abbey
      1.3sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(31, 119, 180);" cx="570.6810927137211" cy="259.41303191726746"><title>Alibon
      1.4sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(31, 119, 180);" cx="548.4888357455671" cy="260.20615035037656"><title>Becontree
      1.3sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(31, 119, 180);" cx="562.3097605628135" cy="218.61341227805977"><title>Chadwell Heath
      3.4sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(31, 119, 180);" cx="590.483529951456" cy="256.1392617242097"><title>Eastbrook
      3.5sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(31, 119, 180);" cx="530.4361680506095" cy="278.8224648317431"><title>Eastbury
      1.4sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(31, 119, 180);" cx="521.3045247951534" cy="289.794061631707"><title>Gascoigne
      1.1sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(31, 119, 180);" cx="562.9819318307999" cy="282.8662588453073"><title>Goresbrook
      1.3sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(31, 119, 180);" cx="559.333919315494" cy="248.8310871309221"><title>Heath
      2sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(31, 119, 180);" cx="519.7614373358325" cy="267.9587512955178"><title>Longbridge
      1.6sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(31, 119, 180);" cx="545.9069905655814" cy="275.56672654483646"><title>Mayesbrook
      1.9sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(31, 119, 180);" cx="559.7872323664307" cy="268.9408177503774"><title>Parsloes
      1.2sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(31, 119, 180);" cx="566.7326238670097" cy="300.39052478581755"><title>River
      3.5sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="12.943932142527048" style="fill: rgb(31, 119, 180);" cx="541.2961440217439" cy="298.38748047198175"><title>Thames
      7.9sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(31, 119, 180);" cx="552.9896053129946" cy="234.37197008983364"><title>Valence
      1.3sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(31, 119, 180);" cx="579.4495204469629" cy="272.4982326839364"><title>Village
      2.1sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(31, 119, 180);" cx="569.0034969440841" cy="235.67706657110563"><title>Whalebone
      1.6sq. km
      Barking and Dagenham</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(174, 199, 232);" cx="317.97936802649355" cy="151.17704370803835"><title>Brunswick Park
      3.2sq. km
      Barnet</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(174, 199, 232);" cx="223.57596956063492" cy="186.85690445128805"><title>Burnt Oak
      2.1sq. km
      Barnet</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(174, 199, 232);" cx="273.5179837929914" cy="243.30628601182815"><title>Childs Hill
      3.1sq. km
      Barnet</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(174, 199, 232);" cx="232.24958323265312" cy="202.71547544001209"><title>Colindale
      2.6sq. km
      Barnet</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(174, 199, 232);" cx="321.1987013635193" cy="180.60901632768218"><title>Coppetts
      2.7sq. km
      Barnet</title></circle><circle class="datum" r="8.858364447777886" style="fill: rgb(174, 199, 232);" cx="302.96077101090606" cy="133.48703215279068"><title>East Barnet
      3.7sq. km
      Barnet</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(174, 199, 232);" cx="299.33876384258156" cy="208.07625279567432"><title>East Finchley
      2.5sq. km
      Barnet</title></circle><circle class="datum" r="10.897997285170621" style="fill: rgb(174, 199, 232);" cx="213.48181638422736" cy="167.78685319742993"><title>Edgware
      5.6sq. km
      Barnet</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(174, 199, 232);" cx="273.31938345922936" cy="196.63775594730214"><title>Finchley Church End
      2.7sq. km
      Barnet</title></circle><circle class="datum" r="9.98393191842393" style="fill: rgb(174, 199, 232);" cx="281.1533328120959" cy="219.0444017343929"><title>Garden Suburb
      4.7sq. km
      Barnet</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(174, 199, 232);" cx="261.0259281538603" cy="227.7718948317984"><title>Golders Green
      3sq. km
      Barnet</title></circle><circle class="datum" r="10.701620889153775" style="fill: rgb(174, 199, 232);" cx="236.24067223927628" cy="156.510058227835"><title>Hale
      5.4sq. km
      Barnet</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(174, 199, 232);" cx="257.34065016823047" cy="206.86238097753545"><title>Hendon
      2.8sq. km
      Barnet</title></circle><circle class="datum" r="13.267580399423718" style="fill: rgb(174, 199, 232);" cx="279.94861343272174" cy="118.33479333479758"><title>High Barnet
      8.3sq. km
      Barnet</title></circle><circle class="datum" r="14.119411924844757" style="fill: rgb(174, 199, 232);" cx="248.08017015480877" cy="182.79357008434852"><title>Mill Hill
      9.4sq. km
      Barnet</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(174, 199, 232);" cx="290.74869842852115" cy="149.5717843645204"><title>Oakleigh
      3.3sq. km
      Barnet</title></circle><circle class="datum" r="13.66136258160975" style="fill: rgb(174, 199, 232);" cx="277.78369828935683" cy="171.93003822518813"><title>Totteridge
      8.8sq. km
      Barnet</title></circle><circle class="datum" r="9.8771488277497" style="fill: rgb(174, 199, 232);" cx="261.33369261725346" cy="138.0762536000925"><title>Underhill
      4.6sq. km
      Barnet</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(174, 199, 232);" cx="292.4673452834722" cy="191.48965450021555"><title>West Finchley
      2.2sq. km
      Barnet</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(174, 199, 232);" cx="242.19702151037365" cy="219.95841144768525"><title>West Hendon
      3.4sq. km
      Barnet</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(174, 199, 232);" cx="302.61317049530345" cy="176.31435113065208"><title>Woodhouse
      2.6sq. km
      Barnet</title></circle><circle class="datum" r="7.842448597217581" style="fill: rgb(255, 127, 14);" cx="582.0653402188609" cy="387.40861384999073"><title>Barnehurst
      2.9sq. km
      Bexley</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(255, 127, 14);" cx="570.7457637978629" cy="343.01921694587566"><title>Belvedere
      3.2sq. km
      Bexley</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 127, 14);" cx="520.5201965728525" cy="409.28773846756275"><title>Blackfen and Lamorbey
      1.7sq. km
      Bexley</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 127, 14);" cx="545.4691082227381" cy="405.6481058865804"><title>Blendon and Penhill
      2.1sq. km
      Bexley</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(255, 127, 14);" cx="564.4626788763235" cy="375.10400254077496"><title>Brampton
      2sq. km
      Bexley</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(255, 127, 14);" cx="568.1400369361039" cy="400.69049626645034"><title>Christchurch
      2.6sq. km
      Bexley</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(255, 127, 14);" cx="592.4359623992866" cy="373.15777127726915"><title>Colyers
      1.6sq. km
      Bexley</title></circle><circle class="datum" r="9.210488773581773" style="fill: rgb(255, 127, 14);" cx="601.3628833884208" cy="395.8223247459626"><title>Crayford
      4sq. km
      Bexley</title></circle><circle class="datum" r="12.357167402236508" style="fill: rgb(255, 127, 14);" cx="550.2322075922236" cy="437.99049033400473"><title>Cray Meadows
      7.2sq. km
      Bexley</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(255, 127, 14);" cx="553.4348055387943" cy="389.3913999832813"><title>Danson Park
      2.7sq. km
      Bexley</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 127, 14);" cx="536.8861879763921" cy="382.5461158572722"><title>East Wickham
      2.2sq. km
      Bexley</title></circle><circle class="datum" r="10.089584933877658" style="fill: rgb(255, 127, 14);" cx="591.7732196708631" cy="350.4971291112399"><title>Erith
      4.8sq. km
      Bexley</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 127, 14);" cx="524.3859045245958" cy="393.79677025159975"><title>Falconwood and Welling
      1.7sq. km
      Bexley</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(255, 127, 14);" cx="557.8864046615732" cy="357.4889038477292"><title>Lesnes Abbey
      2.4sq. km
      Bexley</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(255, 127, 14);" cx="520.6513276985735" cy="433.07503011135697"><title>Longlands
      2.6sq. km
      Bexley</title></circle><circle class="datum" r="10.994870277260807" style="fill: rgb(255, 127, 14);" cx="611.8169308734794" cy="365.5724337533918"><title>North End
      5.7sq. km
      Bexley</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 127, 14);" cx="577.8291514833015" cy="365.1847788910837"><title>Northumberland Heath
      1.8sq. km
      Bexley</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(255, 127, 14);" cx="575.0741623984112" cy="420.512931182641"><title>St. Mary's
      4.4sq. km
      Bexley</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(255, 127, 14);" cx="548.4367611842989" cy="371.10472372301354"><title>St. Michael's
      1.4sq. km
      Bexley</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(255, 127, 14);" cx="534.396401071213" cy="420.05801574855076"><title>Sidcup
      2.7sq. km
      Bexley</title></circle><circle class="datum" r="10.089584933877658" style="fill: rgb(255, 127, 14);" cx="555.7074324597235" cy="326.5205066371455"><title>Thamesmead East
      4.8sq. km
      Bexley</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 187, 120);" cx="201.8631647269227" cy="277.82488009977294"><title>Alperton
      2.1sq. km
      Brent</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(255, 187, 120);" cx="204.7543562532265" cy="227.5188399790194"><title>Barnhill
      3sq. km
      Brent</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 187, 120);" cx="254.33896047274678" cy="268.17993851179415"><title>Brondesbury Park
      1.7sq. km
      Brent</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(255, 187, 120);" cx="238.577205972089" cy="238.86327929518956"><title>Dollis Hill
      2.3sq. km
      Brent</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 187, 120);" cx="228.24822144963713" cy="252.07546001994183"><title>Dudden Hill
      1.7sq. km
      Brent</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(255, 187, 120);" cx="222.23302912910688" cy="218.77518861043248"><title>Fryent
      2.7sq. km
      Brent</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(255, 187, 120);" cx="229.9908483961693" cy="284.1487743009929"><title>Harlesden
      1.1sq. km
      Brent</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(255, 187, 120);" cx="242.63383189032905" cy="278.98878820062356"><title>Kensal Green
      1.1sq. km
      Brent</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 187, 120);" cx="187.4024210467248" cy="220.57292578328753"><title>Kenton
      2.2sq. km
      Brent</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(255, 187, 120);" cx="274.85850821525185" cy="273.7973197376635"><title>Kilburn
      0.9sq. km
      Brent</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(255, 187, 120);" cx="251.38638895677107" cy="248.7040201576762"><title>Mapesbury
      1.4sq. km
      Brent</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(255, 187, 120);" cx="174.87471022730628" cy="234.0836368573593"><title>Northwick Park
      2.7sq. km
      Brent</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(255, 187, 120);" cx="191.80194427299557" cy="241.4929132941149"><title>Preston
      2.4sq. km
      Brent</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 187, 120);" cx="264.1367954311981" cy="279.38244282081234"><title>Queens Park
      1.5sq. km
      Brent</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 187, 120);" cx="213.87731885910716" cy="202.6284644119357"><title>Queensbury
      2.1sq. km
      Brent</title></circle><circle class="datum" r="9.324909170307384" style="fill: rgb(255, 187, 120);" cx="219.82381613469886" cy="269.42141275232194"><title>Stonebridge
      4.1sq. km
      Brent</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 187, 120);" cx="179.38953473970147" cy="254.18572578474408"><title>Sudbury
      2.1sq. km
      Brent</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(255, 187, 120);" cx="206.14170642949793" cy="253.52780312133999"><title>Tokyngton
      2.8sq. km
      Brent</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(255, 187, 120);" cx="220.64947074341796" cy="237.23976775069002"><title>Welsh Harp
      2.3sq. km
      Brent</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(255, 187, 120);" cx="192.36153186574305" cy="264.3647500022178"><title>Wembley Central
      1.6sq. km
      Brent</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 187, 120);" cx="241.42273308664517" cy="260.06883476937304"><title>Willesden Green
      1.5sq. km
      Brent</title></circle><circle class="datum" r="10.194143010775253" style="fill: rgb(44, 160, 44);" cx="478.93276029928717" cy="468.9607728580775"><title>Bickley
      4.9sq. km
      Bromley</title></circle><circle class="datum" r="13.267580399423718" style="fill: rgb(44, 160, 44);" cx="464.57672127240835" cy="590.3509206553631"><title>Biggin Hill
      8.3sq. km
      Bromley</title></circle><circle class="datum" r="13.267580399423718" style="fill: rgb(44, 160, 44);" cx="486.8437387495611" cy="494.76733354205555"><title>Bromley Common and Keston
      8.3sq. km
      Bromley</title></circle><circle class="datum" r="8.858364447777886" style="fill: rgb(44, 160, 44);" cx="461.62771983525266" cy="454.6456981260418"><title>Bromley Town
      3.7sq. km
      Bromley</title></circle><circle class="datum" r="16.34699592775593" style="fill: rgb(44, 160, 44);" cx="534.4499667915593" cy="533.7082269621287"><title>Chelsfield and Pratts Bottom
      12.6sq. km
      Bromley</title></circle><circle class="datum" r="14.851466896085292" style="fill: rgb(44, 160, 44);" cx="499.08853246431045" cy="448.0569027984395"><title>Chislehurst
      10.4sq. km
      Bromley</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(44, 160, 44);" cx="400.22593529151317" cy="458.4352722762889"><title>Clock House
      2.3sq. km
      Bromley</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(44, 160, 44);" cx="429.9045206611527" cy="454.9886736452257"><title>Copers Cope
      3.3sq. km
      Bromley</title></circle><circle class="datum" r="16.794941767255917" style="fill: rgb(44, 160, 44);" cx="547.643352175878" cy="478.6879414333585"><title>Cray Valley East
      13.3sq. km
      Bromley</title></circle><circle class="datum" r="9.09462895681121" style="fill: rgb(44, 160, 44);" cx="524.3185771717845" cy="460.0160665605505"><title>Cray Valley West
      3.9sq. km
      Bromley</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(44, 160, 44);" cx="383.14056955452486" cy="454.08611087681226"><title>Crystal Palace
      2.3sq. km
      Bromley</title></circle><circle class="datum" r="24.8" style="fill: rgb(44, 160, 44);" cx="494.4879678990201" cy="560.7831093021364"><title>Darwin
      29sq. km
      Bromley</title></circle><circle class="datum" r="12.184331374124834" style="fill: rgb(44, 160, 44);" cx="507.7369959697746" cy="515.2740154712624"><title>Farnborough and Crofton
      7sq. km
      Bromley</title></circle><circle class="datum" r="15.13437740081649" style="fill: rgb(44, 160, 44);" cx="456.46589502892505" cy="505.90727659591266"><title>Hayes and Coney Hall
      10.8sq. km
      Bromley</title></circle><circle class="datum" r="10.501572952789438" style="fill: rgb(44, 160, 44);" cx="415.05718748747364" cy="473.74597670262"><title>Kelsey and Eden Park
      5.2sq. km
      Bromley</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(44, 160, 44);" cx="488.2000354179753" cy="423.78360098398434"><title>Mottingham and Chislehurst North
      2.4sq. km
      Bromley</title></circle><circle class="datum" r="9.549638014443088" style="fill: rgb(44, 160, 44);" cx="530.8108214986069" cy="503.90972571314995"><title>Orpington
      4.3sq. km
      Bromley</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(44, 160, 44);" cx="395.67626968331695" cy="440.03834197556756"><title>Penge and Cator
      3sq. km
      Bromley</title></circle><circle class="datum" r="9.549638014443088" style="fill: rgb(44, 160, 44);" cx="514.6101347531591" cy="487.44549079362355"><title>Petts Wood and Knoll
      4.3sq. km
      Bromley</title></circle><circle class="datum" r="9.210488773581773" style="fill: rgb(44, 160, 44);" cx="471.2874840198638" cy="434.94688636175505"><title>Plaistow and Sundridge
      4sq. km
      Bromley</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(44, 160, 44);" cx="449.4857876818837" cy="470.2928479218815"><title>Shortlands
      2.5sq. km
      Bromley</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(44, 160, 44);" cx="435.9062193754507" cy="485.8886736914133"><title>West Wickham
      4.4sq. km
      Bromley</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(152, 223, 138);" cx="303.07943702574966" cy="264.99378005166096"><title>Belsize
      0.8sq. km
      Camden</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(152, 223, 138);" cx="331.79698697506666" cy="297.87209320527035"><title>Bloomsbury
      1sq. km
      Camden</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(152, 223, 138);" cx="322.03031239350776" cy="275.2179606971323"><title>Camden Town with Primrose Hill
      1.2sq. km
      Camden</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(152, 223, 138);" cx="331.4558792410051" cy="266.0287812287415"><title>Cantelowes
      0.8sq. km
      Camden</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(152, 223, 138);" cx="262.8660876016494" cy="256.17176210090156"><title>Fortune Green
      1sq. km
      Camden</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(152, 223, 138);" cx="289.65683969572507" cy="256.4961114374984"><title>Frognal and Fitzjohns
      1.5sq. km
      Camden</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(152, 223, 138);" cx="308.6165087063985" cy="254.89282175393575"><title>Gospel Oak
      0.7sq. km
      Camden</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(152, 223, 138);" cx="298.50129450094477" cy="243.9909669035047"><title>Hampstead Town
      2.4sq. km
      Camden</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(152, 223, 138);" cx="314.9368232525556" cy="264.64549015657013"><title>Haverstock
      0.7sq. km
      Camden</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(152, 223, 138);" cx="316.85358677720114" cy="241.42062058217206"><title>Highgate
      3.2sq. km
      Camden</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(152, 223, 138);" cx="341.9224026379028" cy="305.5145390577195"><title>Holborn and Covent Garden
      1.2sq. km
      Camden</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(152, 223, 138);" cx="324.1567323509591" cy="256.2651648981229"><title>Kentish Town
      1sq. km
      Camden</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(152, 223, 138);" cx="283.5963059290067" cy="267.64269070556173"><title>Kilburn
      0.7sq. km
      Camden</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(152, 223, 138);" cx="342.4954306080271" cy="292.775017010634"><title>King's Cross
      0.6sq. km
      Camden</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(152, 223, 138);" cx="321.2980160110466" cy="289.9405914400979"><title>Regent's Park
      1.3sq. km
      Camden</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(152, 223, 138);" cx="334.1443776436457" cy="282.9795247055421"><title>St. Pancras and Somers Town
      1.4sq. km
      Camden</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(152, 223, 138);" cx="293.8331698307958" cy="274.21377201833826"><title>Swiss Cottage
      1.3sq. km
      Camden</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(152, 223, 138);" cx="274.9727211501671" cy="259.52019258238903"><title>West Hampstead
      0.9sq. km
      Camden</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(214, 39, 40);" cx="377.9856958333717" cy="494.00057231353236"><title>Addiscombe
      1.6sq. km
      Croydon</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(214, 39, 40);" cx="401.3642592529211" cy="496.043641133385"><title>Ashburton
      2.7sq. km
      Croydon</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(214, 39, 40);" cx="349.9352250180496" cy="476.2175683533179"><title>Bensham Manor
      1.4sq. km
      Croydon</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(214, 39, 40);" cx="350.2538652767867" cy="496.49277803225544"><title>Broad Green
      2.7sq. km
      Croydon</title></circle><circle class="datum" r="12.779034554219308" style="fill: rgb(214, 39, 40);" cx="330.658135018244" cy="598.9003744838167"><title>Coulsdon East
      7.7sq. km
      Croydon</title></circle><circle class="datum" r="10.297639501863758" style="fill: rgb(214, 39, 40);" cx="323.67155227301447" cy="572.6962170052275"><title>Coulsdon West
      5sq. km
      Croydon</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(214, 39, 40);" cx="368.3376062828649" cy="530.4561212354204"><title>Croham
      3.5sq. km
      Croydon</title></circle><circle class="datum" r="8.977273989127326" style="fill: rgb(214, 39, 40);" cx="366.58697032481257" cy="508.93097061338915"><title>Fairfield
      3.8sq. km
      Croydon</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(214, 39, 40);" cx="430.64864543682177" cy="534.5663234146302"><title>Fieldway
      1.5sq. km
      Croydon</title></circle><circle class="datum" r="13.583519426128118" style="fill: rgb(214, 39, 40);" cx="410.1117645966118" cy="523.0684875966742"><title>Heathfield
      8.7sq. km
      Croydon</title></circle><circle class="datum" r="11.741115496555183" style="fill: rgb(214, 39, 40);" cx="349.21444925797806" cy="577.4560063908768"><title>Kenley
      6.5sq. km
      Croydon</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(214, 39, 40);" cx="437.2954556369977" cy="549.9675966045825"><title>New Addington
      2.4sq. km
      Croydon</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(214, 39, 40);" cx="343.8589339424549" cy="458.17597058904016"><title>Norbury
      2.5sq. km
      Croydon</title></circle><circle class="datum" r="9.437942499331603" style="fill: rgb(214, 39, 40);" cx="354.5098677443808" cy="549.6554813707634"><title>Purley
      4.2sq. km
      Croydon</title></circle><circle class="datum" r="11.559071672545096" style="fill: rgb(214, 39, 40);" cx="373.62098552546513" cy="565.6788152939337"><title>Sanderstead
      6.3sq. km
      Croydon</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(214, 39, 40);" cx="364.19023174016144" cy="484.39338029235734"><title>Selhurst
      2.3sq. km
      Croydon</title></circle><circle class="datum" r="11.650449155171719" style="fill: rgb(214, 39, 40);" cx="390.70969926024475" cy="544.6277352970436"><title>Selsdon and Ballards
      6.4sq. km
      Croydon</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(214, 39, 40);" cx="420.26543476580014" cy="500.04843996988006"><title>Shirley
      2.8sq. km
      Croydon</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(214, 39, 40);" cx="375.82187921871264" cy="470.54542664694446"><title>South Norwood
      2.4sq. km
      Croydon</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(214, 39, 40);" cx="359.8241412930701" cy="464.5159459720315"><title>Thornton Heath
      1.7sq. km
      Croydon</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(214, 39, 40);" cx="365.90370576691333" cy="448.3353314587204"><title>Upper Norwood
      2.6sq. km
      Croydon</title></circle><circle class="datum" r="8.737836866378789" style="fill: rgb(214, 39, 40);" cx="348.787631133606" cy="521.3578494761002"><title>Waddon
      3.6sq. km
      Croydon</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(214, 39, 40);" cx="336.5038112810626" cy="484.7786399104727"><title>West Thornton
      2sq. km
      Croydon</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(214, 39, 40);" cx="389.7201156785711" cy="481.8695267451567"><title>Woodside
      2.2sq. km
      Croydon</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 152, 150);" cx="202.5526214328917" cy="309.20998603914825"><title>Acton Central
      1.8sq. km
      Ealing</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 152, 150);" cx="164.74187053906252" cy="316.75404426251686"><title>Cleveland
      2.2sq. km
      Ealing</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(255, 152, 150);" cx="139.58338192701012" cy="312.14612520638707"><title>Dormers Wells
      2.3sq. km
      Ealing</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(255, 152, 150);" cx="178.53904873958828" cy="306.84991962803815"><title>Ealing Broadway
      1.9sq. km
      Ealing</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 152, 150);" cx="189.64838092761622" cy="319.71278230436593"><title>Ealing Common
      2.1sq. km
      Ealing</title></circle><circle class="datum" r="9.549638014443088" style="fill: rgb(255, 152, 150);" cx="220.43575143575774" cy="301.21078210189086"><title>East Acton
      4.3sq. km
      Ealing</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(255, 152, 150);" cx="155.03087814428335" cy="331.082971447726"><title>Elthorne
      2sq. km
      Ealing</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(255, 152, 150);" cx="135.72487011824475" cy="289.6049369557995"><title>Greenford Broadway
      2.5sq. km
      Ealing</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(255, 152, 150);" cx="148.45958726558402" cy="274.560854246079"><title>Greenford Green
      3.4sq. km
      Ealing</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(255, 152, 150);" cx="192.06137312523234" cy="293.99922572711944"><title>Hanger Hill
      3.3sq. km
      Ealing</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 152, 150);" cx="154.48263519476447" cy="302.38407744161736"><title>Hobbayne
      2.2sq. km
      Ealing</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 152, 150);" cx="125.6362598778788" cy="303.1174227733578"><title>Lady Margaret
      1.5sq. km
      Ealing</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 152, 150);" cx="169.20223998222346" cy="342.19243020422044"><title>Northfield
      1.5sq. km
      Ealing</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(255, 152, 150);" cx="160.71517748164018" cy="257.70480246619036"><title>North Greenford
      3.3sq. km
      Ealing</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(255, 152, 150);" cx="131.13652355724489" cy="264.2069076686069"><title>Northolt Mandeville
      2.8sq. km
      Ealing</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(255, 152, 150);" cx="118.34889822791851" cy="279.94282465315024"><title>Northolt West End
      3.5sq. km
      Ealing</title></circle><circle class="datum" r="8.977273989127326" style="fill: rgb(255, 152, 150);" cx="133.02218917483347" cy="330.99707745379555"><title>Norwood Green
      3.8sq. km
      Ealing</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(255, 152, 150);" cx="172.0124422168089" cy="279.83458704241656"><title>Perivale
      3.4sq. km
      Ealing</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 152, 150);" cx="203.05639543377006" cy="329.57230561600227"><title>South Acton
      1.7sq. km
      Ealing</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(255, 152, 150);" cx="119.9789576145661" cy="317.4552221017276"><title>Southall Broadway
      1.6sq. km
      Ealing</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(255, 152, 150);" cx="113.26095871616958" cy="331.5366331143139"><title>Southall Green
      1.6sq. km
      Ealing</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(255, 152, 150);" cx="214.354810613758" cy="319.063543709843"><title>Southfield
      1.4sq. km
      Ealing</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 152, 150);" cx="176.12132309090666" cy="328.6575527281281"><title>Walpole
      1.5sq. km
      Ealing</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(148, 103, 189);" cx="346.4513924912465" cy="173.83247440794815"><title>Bowes
      1.5sq. km
      Enfield</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(148, 103, 189);" cx="384.7551360754078" cy="144.05142841665435"><title>Bush Hill Park
      2.5sq. km
      Enfield</title></circle><circle class="datum" r="18.931979877154042" style="fill: rgb(148, 103, 189);" cx="377.8626349678957" cy="89.72600637912011"><title>Chase
      16.9sq. km
      Enfield</title></circle><circle class="datum" r="14.851466896085292" style="fill: rgb(148, 103, 189);" cx="326.942553821366" cy="120.40135039510417"><title>Cockfosters
      10.4sq. km
      Enfield</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(148, 103, 189);" cx="394.65402299480354" cy="160.55262662836094"><title>Edmonton Green
      3.1sq. km
      Enfield</title></circle><circle class="datum" r="9.8771488277497" style="fill: rgb(148, 103, 189);" cx="423.69406348158003" cy="105.88859395486483"><title>Enfield Highway
      4.6sq. km
      Enfield</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(148, 103, 189);" cx="434.6422757189816" cy="86.75647129785033"><title>Enfield Lock
      3.3sq. km
      Enfield</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(148, 103, 189);" cx="369.92109345957374" cy="131.26684225947687"><title>Grange
      3.3sq. km
      Enfield</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(148, 103, 189);" cx="374.47998468535746" cy="157.9378333732172"><title>Haselbury
      1.8sq. km
      Enfield</title></circle><circle class="datum" r="10.400106100254542" style="fill: rgb(148, 103, 189);" cx="355.25631294458356" cy="113.87019631570648"><title>Highlands
      5.1sq. km
      Enfield</title></circle><circle class="datum" r="9.09462895681121" style="fill: rgb(148, 103, 189);" cx="410.37501410470276" cy="147.39361531306827"><title>Jubilee
      3.9sq. km
      Enfield</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(148, 103, 189);" cx="412.2993141255021" cy="166.83235441597893"><title>Lower Edmonton
      2.2sq. km
      Enfield</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(148, 103, 189);" cx="360.72026951577067" cy="166.98027203367025"><title>Palmers Green
      1.9sq. km
      Enfield</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(148, 103, 189);" cx="418.3722245604786" cy="127.38577851643542"><title>Ponders End
      3.5sq. km
      Enfield</title></circle><circle class="datum" r="7.842448597217581" style="fill: rgb(148, 103, 189);" cx="398.3399608284318" cy="130.6675670698976"><title>Southbury
      2.9sq. km
      Enfield</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(148, 103, 189);" cx="338.14067990376435" cy="146.08691781214472"><title>Southgate
      2.7sq. km
      Enfield</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(148, 103, 189);" cx="331.9451323315898" cy="164.9647337615933"><title>Southgate Green
      2.6sq. km
      Enfield</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(148, 103, 189);" cx="384.32288165727095" cy="118.58685065097875"><title>Town
      2.2sq. km
      Enfield</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(148, 103, 189);" cx="407.6594858441101" cy="92.29738102280635"><title>Turkey Street
      2.3sq. km
      Enfield</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(148, 103, 189);" cx="381.4402939972702" cy="173.855369576985"><title>Upper Edmonton
      2.6sq. km
      Enfield</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(148, 103, 189);" cx="358.5991034496006" cy="149.05194217988242"><title>Winchmore Hill
      2.8sq. km
      Enfield</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(197, 176, 213);" cx="544.143864821616" cy="344.82635488612544"><title>Abbey Wood
      2.7sq. km
      Greenwich</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(197, 176, 213);" cx="461.66486670160924" cy="366.17471015214056"><title>Blackheath Westcombe
      2.1sq. km
      Greenwich</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(197, 176, 213);" cx="476.2221100433782" cy="356.97147740049246"><title>Charlton
      2sq. km
      Greenwich</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(197, 176, 213);" cx="505.6276356501527" cy="417.9635988774789"><title>Coldharbour and New Eltham
      2.5sq. km
      Greenwich</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(197, 176, 213);" cx="500.92302838521294" cy="381.04229745813785"><title>Eltham North
      2.6sq. km
      Greenwich</title></circle><circle class="datum" r="9.8771488277497" style="fill: rgb(197, 176, 213);" cx="493.25042584617955" cy="400.80662816748156"><title>Eltham South
      4.6sq. km
      Greenwich</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(197, 176, 213);" cx="476.0457557333915" cy="388.7344917314216"><title>Eltham West
      2.4sq. km
      Greenwich</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(197, 176, 213);" cx="516.7286900832753" cy="343.49943019098396"><title>Glyndon
      1.7sq. km
      Greenwich</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(197, 176, 213);" cx="432.3948903809935" cy="365.55752087782287"><title>Greenwich West
      2.8sq. km
      Greenwich</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(197, 176, 213);" cx="484.4534275914323" cy="372.5196937099443"><title>Kidbrooke with Hornfair
      2.4sq. km
      Greenwich</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(197, 176, 213);" cx="472.6599898385616" cy="408.96640970917815"><title>Middle Park and Sutcliffe
      3.3sq. km
      Greenwich</title></circle><circle class="datum" r="9.769198604763357" style="fill: rgb(197, 176, 213);" cx="459.32104524804464" cy="345.88260864316"><title>Peninsula
      4.5sq. km
      Greenwich</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(197, 176, 213);" cx="528.8839109511393" cy="355.3660095490992"><title>Plumstead
      2.3sq. km
      Greenwich</title></circle><circle class="datum" r="8.977273989127326" style="fill: rgb(197, 176, 213);" cx="519.9075421736336" cy="373.3073001884034"><title>Shooters Hill
      3.8sq. km
      Greenwich</title></circle><circle class="datum" r="10.089584933877658" style="fill: rgb(197, 176, 213);" cx="531.189840368966" cy="327.4758662224539"><title>Thamesmead Moorings
      4.8sq. km
      Greenwich</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(197, 176, 213);" cx="507.21716738520684" cy="358.18190690779954"><title>Woolwich Common
      2.6sq. km
      Greenwich</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(197, 176, 213);" cx="494.9812098321801" cy="343.4289604807455"><title>Woolwich Riverside
      3.3sq. km
      Greenwich</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="253.05706758342572" cy="329.2130374606419"><title>Addison
      0.6sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(140, 86, 75);" cx="233.30147554836947" cy="322.45376908308486"><title>Askew
      0.8sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(140, 86, 75);" cx="260.40181202439686" cy="338.35349063678314"><title>Avonmore and Brook Green
      0.9sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(140, 86, 75);" cx="241.76752935114246" cy="296.5723701616809"><title>College Park and Old Oak
      3.4sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(140, 86, 75);" cx="273.61074040987836" cy="356.93834964748453"><title>Fulham Broadway
      0.7sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(140, 86, 75);" cx="258.5763530171691" cy="353.14628088770473"><title>Fulham Reach
      0.9sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(140, 86, 75);" cx="248.80543846398365" cy="344.322075090789"><title>Hammersmith Broadway
      1.1sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="264.39944758283985" cy="363.5275324467229"><title>Munster
      0.6sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="268.6731022002881" cy="346.78234198897337"><title>North End
      0.6sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(140, 86, 75);" cx="255.1279830656487" cy="372.89493706116224"><title>Palace Riverside
      1.5sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(140, 86, 75);" cx="282.31110369630215" cy="365.31160973366536"><title>Parsons Green and Walham
      0.9sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(140, 86, 75);" cx="239.47779969999868" cy="334.06497953254984"><title>Ravenscourt Park
      1.2sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(140, 86, 75);" cx="287.7594724342991" cy="378.0259689833121"><title>Sands End
      1.4sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(140, 86, 75);" cx="245.28481066433636" cy="319.72926580559573"><title>Shepherd's Bush Green
      1.1sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(140, 86, 75);" cx="272.18616910995576" cy="371.8734550530251"><title>Town
      0.7sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(140, 86, 75);" cx="235.06922126756254" cy="311.460450172287"><title>Wormholt and White City
      0.9sq. km
      Hammersmith and Fulham</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(196, 156, 148);" cx="330.3584847574226" cy="201.008791332149"><title>Alexandra
      2.6sq. km
      Haringey</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(196, 156, 148);" cx="337.41895669099245" cy="185.76740857831567"><title>Bounds Green
      1.4sq. km
      Haringey</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(196, 156, 148);" cx="382.7551326914294" cy="198.96964874672653"><title>Bruce Grove
      0.9sq. km
      Haringey</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(196, 156, 148);" cx="334.92496416937416" cy="217.1699244274764"><title>Crouch End
      1.4sq. km
      Haringey</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(196, 156, 148);" cx="312.97967847066485" cy="196.67299909602056"><title>Fortis Green
      2sq. km
      Haringey</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(196, 156, 148);" cx="349.3775276469153" cy="221.83091445606573"><title>Harringay
      1.6sq. km
      Haringey</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(196, 156, 148);" cx="305.98389309467" cy="225.2745376573215"><title>Highgate
      2.5sq. km
      Haringey</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(196, 156, 148);" cx="345.20521025063914" cy="207.43872334448682"><title>Hornsey
      1.1sq. km
      Haringey</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(196, 156, 148);" cx="319.5448997722376" cy="214.59906430704757"><title>Muswell Hill
      1.7sq. km
      Haringey</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(196, 156, 148);" cx="349.1409291104205" cy="194.19663559972062"><title>Noel Park
      1.2sq. km
      Haringey</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(196, 156, 148);" cx="393.444070241882" cy="186.81969329559126"><title>Northumberland Park
      1.9sq. km
      Haringey</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(196, 156, 148);" cx="372.72161848543954" cy="209.2562130941924"><title>St. Ann's
      1.1sq. km
      Haringey</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(196, 156, 148);" cx="358.11256109474755" cy="211.8293460717421"><title>Seven Sisters
      1.3sq. km
      Haringey</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(196, 156, 148);" cx="356.3894030824163" cy="234.71249527884538"><title>Stroud Green
      1.1sq. km
      Haringey</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(196, 156, 148);" cx="385.06987883759734" cy="216.29642779822805"><title>Tottenham Green
      1.4sq. km
      Haringey</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(196, 156, 148);" cx="395.99018466401" cy="204.8892528339445"><title>Tottenham Hale
      1.9sq. km
      Haringey</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(196, 156, 148);" cx="362.67197144231125" cy="199.16374440424264"><title>West Green
      1.4sq. km
      Haringey</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(196, 156, 148);" cx="373.1785436579671" cy="188.43623735894275"><title>White Hart Lane
      1.7sq. km
      Haringey</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(196, 156, 148);" cx="358.58370766684624" cy="182.9702757391646"><title>Woodside
      1.5sq. km
      Haringey</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(227, 119, 194);" cx="174.01388183189306" cy="190.76024430608425"><title>Belmont
      1.8sq. km
      Harrow</title></circle><circle class="datum" r="10.897997285170621" style="fill: rgb(227, 119, 194);" cx="189.78803621907613" cy="177.40390506783004"><title>Canons
      5.6sq. km
      Harrow</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(227, 119, 194);" cx="207.12164203248346" cy="188.04331681592186"><title>Edgware
      1.4sq. km
      Harrow</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(227, 119, 194);" cx="165.93928482064194" cy="219.18652212923084"><title>Greenhill
      1.7sq. km
      Harrow</title></circle><circle class="datum" r="8.737836866378789" style="fill: rgb(227, 119, 194);" cx="154.79982206470987" cy="237.00365952244218"><title>Harrow on the Hill
      3.6sq. km
      Harrow</title></circle><circle class="datum" r="9.8771488277497" style="fill: rgb(227, 119, 194);" cx="152.73191393780587" cy="183.1839064348353"><title>Harrow Weald
      4.6sq. km
      Harrow</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(227, 119, 194);" cx="129.94304228278486" cy="181.6947587443011"><title>Hatch End
      3.3sq. km
      Harrow</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(227, 119, 194);" cx="135.36617858153454" cy="206.09750798010063"><title>Headstone North
      3.3sq. km
      Harrow</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(227, 119, 194);" cx="143.8246087259154" cy="222.0094797289927"><title>Headstone South
      1.5sq. km
      Harrow</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(227, 119, 194);" cx="200.39903101902462" cy="211.07446382886684"><title>Kenton East
      1.3sq. km
      Harrow</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(227, 119, 194);" cx="177.38324014118672" cy="206.8661013006493"><title>Kenton West
      1.8sq. km
      Harrow</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(227, 119, 194);" cx="152.78687037379544" cy="210.53803535697656"><title>Marlborough
      1.6sq. km
      Harrow</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(227, 119, 194);" cx="116.40825826432513" cy="197.96598611703487"><title>Pinner
      3.3sq. km
      Harrow</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(227, 119, 194);" cx="119.41951662226944" cy="217.05713618285145"><title>Pinner South
      2.3sq. km
      Harrow</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(227, 119, 194);" cx="193.86431797325486" cy="197.58979855175156"><title>Queensbury
      1.6sq. km
      Harrow</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(227, 119, 194);" cx="119.69749702143199" cy="234.28093906153805"><title>Rayners Lane
      1.5sq. km
      Harrow</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(227, 119, 194);" cx="127.8344781509946" cy="247.20830014068673"><title>Roxbourne
      1.5sq. km
      Harrow</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(227, 119, 194);" cx="142.81202519394043" cy="251.1627745156756"><title>Roxeth
      1.6sq. km
      Harrow</title></circle><circle class="datum" r="9.769198604763357" style="fill: rgb(227, 119, 194);" cx="168.28891218361537" cy="165.37775628169618"><title>Stanmore Park
      4.5sq. km
      Harrow</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(227, 119, 194);" cx="162.24875413114853" cy="199.46704906436221"><title>Wealdstone
      1.2sq. km
      Harrow</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(227, 119, 194);" cx="134.51719261156444" cy="233.49793851398474"><title>West Harrow
      1.5sq. km
      Harrow</title></circle><circle class="datum" r="9.437942499331603" style="fill: rgb(247, 182, 210);" cx="588.1943193782316" cy="234.21159343405068"><title>Brooklands
      4.2sq. km
      Havering</title></circle><circle class="datum" r="11.831087045984203" style="fill: rgb(247, 182, 210);" cx="672.9524327656255" cy="234.1886352128186"><title>Cranham
      6.6sq. km
      Havering</title></circle><circle class="datum" r="8.858364447777886" style="fill: rgb(247, 182, 210);" cx="608.9955492526324" cy="276.3122976805826"><title>Elm Park
      3.7sq. km
      Havering</title></circle><circle class="datum" r="9.8771488277497" style="fill: rgb(247, 182, 210);" cx="641.4998095358147" cy="226.72446596674175"><title>Emerson Park
      4.6sq. km
      Havering</title></circle><circle class="datum" r="12.861747615473488" style="fill: rgb(247, 182, 210);" cx="635.8068062545497" cy="175.1320920855098"><title>Gooshays
      7.8sq. km
      Havering</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(247, 182, 210);" cx="622.9114877123096" cy="262.1447443499652"><title>Hacton
      2.5sq. km
      Havering</title></circle><circle class="datum" r="12.695782628563084" style="fill: rgb(247, 182, 210);" cx="649.2842378155682" cy="201.4240630468037"><title>Harold Wood
      7.6sq. km
      Havering</title></circle><circle class="datum" r="14.41669530260926" style="fill: rgb(247, 182, 210);" cx="581.5470249339909" cy="181.8946446985141"><title>Havering Park
      9.8sq. km
      Havering</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(247, 182, 210);" cx="619.8734183776447" cy="194.63178584787806"><title>Heaton
      3.4sq. km
      Havering</title></circle><circle class="datum" r="7.842448597217581" style="fill: rgb(247, 182, 210);" cx="612.0279652162785" cy="241.22628790282522"><title>Hylands
      2.9sq. km
      Havering</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(247, 182, 210);" cx="579.5399857885108" cy="208.30762745185226"><title>Mawneys
      3sq. km
      Havering</title></circle><circle class="datum" r="9.210488773581773" style="fill: rgb(247, 182, 210);" cx="599.7953269281171" cy="202.54460776680756"><title>Pettits
      4sq. km
      Havering</title></circle><circle class="datum" r="18.931979877154042" style="fill: rgb(247, 182, 210);" cx="618.4637840807314" cy="312.9563970973393"><title>Rainham and Wennington
      16.9sq. km
      Havering</title></circle><circle class="datum" r="7.842448597217581" style="fill: rgb(247, 182, 210);" cx="606.0210080556077" cy="222.60782661016455"><title>Romford Town
      2.9sq. km
      Havering</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(247, 182, 210);" cx="630.8969153672158" cy="245.172573267384"><title>St. Andrew's
      2.7sq. km
      Havering</title></circle><circle class="datum" r="12.09698737075789" style="fill: rgb(247, 182, 210);" cx="590.076426243197" cy="292.50773456483614"><title>South Hornchurch
      6.9sq. km
      Havering</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(247, 182, 210);" cx="623.7457041097338" cy="214.7002437175478"><title>Squirrel's Heath
      2.7sq. km
      Havering</title></circle><circle class="datum" r="21.84459216594697" style="fill: rgb(247, 182, 210);" cx="655.6264417992197" cy="267.6309377005502"><title>Upminster
      22.5sq. km
      Havering</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(127, 127, 127);" cx="93.89955557843517" cy="304.92904487506695"><title>Barnhill
      2.1sq. km
      Hillingdon</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(127, 127, 127);" cx="76.14509986824915" cy="314.80349785175713"><title>Botwell
      4.4sq. km
      Hillingdon</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(127, 127, 127);" cx="57.45596910688603" cy="289.4529812887087"><title>Brunel
      3.3sq. km
      Hillingdon</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(127, 127, 127);" cx="104.41310586825156" cy="237.95138209808735"><title>Cavendish
      2sq. km
      Hillingdon</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(127, 127, 127);" cx="82.26144967636625" cy="289.9742627976427"><title>Charville
      3sq. km
      Hillingdon</title></circle><circle class="datum" r="9.324909170307384" style="fill: rgb(127, 127, 127);" cx="98.45101292749895" cy="218.41312302690525"><title>Eastcote and East Ruislip
      4.1sq. km
      Hillingdon</title></circle><circle class="datum" r="17.954547978254652" style="fill: rgb(127, 127, 127);" cx="36.99628822318477" cy="190.8087698103289"><title>Harefield
      15.2sq. km
      Hillingdon</title></circle><circle class="datum" r="22.324750452325794" style="fill: rgb(127, 127, 127);" cx="56.8832857616658" cy="361.44690668399926"><title>Heathrow Villages
      23.5sq. km
      Hillingdon</title></circle><circle class="datum" r="8.737836866378789" style="fill: rgb(127, 127, 127);" cx="70.5244033718469" cy="272.90602151158276"><title>Hillingdon East
      3.6sq. km
      Hillingdon</title></circle><circle class="datum" r="11.466966047949544" style="fill: rgb(127, 127, 127);" cx="61.170823306067646" cy="245.59863612108737"><title>Ickenham
      6.2sq. km
      Hillingdon</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(127, 127, 127);" cx="87.95423945594813" cy="242.58905902681516"><title>Manor
      2sq. km
      Hillingdon</title></circle><circle class="datum" r="12.527619142491137" style="fill: rgb(127, 127, 127);" cx="78.08865701115548" cy="176.3637376032538"><title>Northwood
      7.4sq. km
      Hillingdon</title></circle><circle class="datum" r="8.365841879023748" style="fill: rgb(127, 127, 127);" cx="96.27784980612306" cy="193.31908314952105"><title>Northwood Hills
      3.3sq. km
      Hillingdon</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(127, 127, 127);" cx="79.9282305052646" cy="335.69409996876124"><title>Pinkwell
      2.7sq. km
      Hillingdon</title></circle><circle class="datum" r="12.527619142491137" style="fill: rgb(127, 127, 127);" cx="102.0659508346081" cy="260.79626588092066"><title>South Ruislip
      7.4sq. km
      Hillingdon</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(127, 127, 127);" cx="96.40939965556775" cy="324.04583443584306"><title>Townfield
      3.5sq. km
      Hillingdon</title></circle><circle class="datum" r="9.8771488277497" style="fill: rgb(127, 127, 127);" cx="48.50251316336112" cy="267.7679222284826"><title>Uxbridge North
      4.6sq. km
      Hillingdon</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(127, 127, 127);" cx="31.460760786784885" cy="281.65617739823796"><title>Uxbridge South
      3.1sq. km
      Hillingdon</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(127, 127, 127);" cx="41.93909428813771" cy="329.8989059676866"><title>West Drayton
      3.5sq. km
      Hillingdon</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(127, 127, 127);" cx="76.703379370483" cy="225.84871758446266"><title>West Ruislip
      4.4sq. km
      Hillingdon</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(127, 127, 127);" cx="109.94834706183724" cy="297.6160913284582"><title>Yeading
      2.3sq. km
      Hillingdon</title></circle><circle class="datum" r="9.210488773581773" style="fill: rgb(127, 127, 127);" cx="48.862447120363925" cy="309.21715573528786"><title>Yiewsley
      4sq. km
      Hillingdon</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(199, 199, 199);" cx="72.02022761666244" cy="393.7723210325934"><title>Bedfont
      4.4sq. km
      Hounslow</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(199, 199, 199);" cx="187.39968778310768" cy="343.9719646597259"><title>Brentford
      3.2sq. km
      Hounslow</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(199, 199, 199);" cx="229.67595613245882" cy="347.38719588115123"><title>Chiswick Homefields
      2.3sq. km
      Hounslow</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(199, 199, 199);" cx="212.5500191515272" cy="343.2524496691586"><title>Chiswick Riverside
      2.1sq. km
      Hounslow</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(199, 199, 199);" cx="101.21438022739645" cy="369.1338436945761"><title>Cranford
      2.7sq. km
      Hounslow</title></circle><circle class="datum" r="8.49165107214342" style="fill: rgb(199, 199, 199);" cx="95.61180482232258" cy="391.46562515994975"><title>Feltham North
      3.4sq. km
      Hounslow</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(199, 199, 199);" cx="85.92821503683038" cy="410.0772643110716"><title>Feltham West
      3.2sq. km
      Hounslow</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(199, 199, 199);" cx="124.61976682644661" cy="424.86386324754216"><title>Hanworth
      3.2sq. km
      Hounslow</title></circle><circle class="datum" r="8.858364447777886" style="fill: rgb(199, 199, 199);" cx="104.83776970819913" cy="418.63254899390773"><title>Hanworth Park
      3.7sq. km
      Hounslow</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(199, 199, 199);" cx="116.66605143883689" cy="360.7809283068396"><title>Heston Central
      1.7sq. km
      Hounslow</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(199, 199, 199);" cx="130.8136768044068" cy="351.95152796157197"><title>Heston East
      2.1sq. km
      Hounslow</title></circle><circle class="datum" r="8.977273989127326" style="fill: rgb(199, 199, 199);" cx="103.23346399965483" cy="347.4247991668937"><title>Heston West
      3.8sq. km
      Hounslow</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(199, 199, 199);" cx="137.1905752722051" cy="369.9840899156871"><title>Hounslow Central
      1.7sq. km
      Hounslow</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(199, 199, 199);" cx="133.5756822896164" cy="387.30909020516856"><title>Hounslow Heath
      2.8sq. km
      Hounslow</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(199, 199, 199);" cx="149.88399845108728" cy="380.0225649688849"><title>Hounslow South
      1.8sq. km
      Hounslow</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(199, 199, 199);" cx="120.06272368128796" cy="376.18658573073"><title>Hounslow West
      1.6sq. km
      Hounslow</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(199, 199, 199);" cx="166.30041651084554" cy="377.02055584299853"><title>Isleworth
      2sq. km
      Hounslow</title></circle><circle class="datum" r="11.559071672545096" style="fill: rgb(199, 199, 199);" cx="155.10507852696335" cy="357.99615302222645"><title>Osterley and Spring Grove
      6.3sq. km
      Hounslow</title></circle><circle class="datum" r="7.842448597217581" style="fill: rgb(199, 199, 199);" cx="178.189980286866" cy="361.8153052068025"><title>Syon
      2.9sq. km
      Hounslow</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(199, 199, 199);" cx="223.4944029293527" cy="331.48139103444714"><title>Turnham Green
      1.8sq. km
      Hounslow</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="348.8117564439706" cy="283.13768981541637"><title>Barnsbury
      0.8sq. km
      Islington</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(188, 189, 34);" cx="365.7683212157498" cy="301.01350748991786"><title>Bunhill
      1.1sq. km
      Islington</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(188, 189, 34);" cx="342.6827159631428" cy="271.51333287302174"><title>Caledonian
      1.1sq. km
      Islington</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="366.6806682441797" cy="277.30848140575495"><title>Canonbury
      0.8sq. km
      Islington</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(188, 189, 34);" cx="353.07818808687495" cy="297.9456040646862"><title>Clerkenwell
      0.9sq. km
      Islington</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(188, 189, 34);" cx="345.42376262901854" cy="242.05937033795914"><title>Finsbury Park
      0.9sq. km
      Islington</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(188, 189, 34);" cx="361.3928923681778" cy="261.22082524536904"><title>Highbury East
      1sq. km
      Islington</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(188, 189, 34);" cx="356.540375436934" cy="248.8432270713961"><title>Highbury West
      1.1sq. km
      Islington</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="326.6708850630389" cy="227.8784980461578"><title>Hillrise
      0.8sq. km
      Islington</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(188, 189, 34);" cx="348.0796188690283" cy="259.2729510392051"><title>Holloway
      1sq. km
      Islington</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(188, 189, 34);" cx="332.23984362994184" cy="239.60181033880323"><title>Junction
      1sq. km
      Islington</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="373.1709607263292" cy="265.4230066610698"><title>Mildmay
      0.8sq. km
      Islington</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="337.71405130854913" cy="251.89325697268674"><title>St. George's
      0.8sq. km
      Islington</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(188, 189, 34);" cx="355.4731122128709" cy="272.6783425220591"><title>St. Mary's
      0.9sq. km
      Islington</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="360.16034817741235" cy="287.67192955276"><title>St. Peter's
      0.8sq. km
      Islington</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(188, 189, 34);" cx="340.1298889435531" cy="230.54609635722474"><title>Tollington
      0.8sq. km
      Islington</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(31, 119, 180);" cx="215.25869743461317" cy="479.0112927595428"><title>Alexandra
      2.7sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(31, 119, 180);" cx="196.98170868063593" cy="479.4896971793143"><title>Berrylands
      1.5sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(31, 119, 180);" cx="227.291617284606" cy="465.77556484611694"><title>Beverley
      1.9sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(31, 119, 180);" cx="199.17613239962765" cy="450.64537186035375"><title>Canbury
      1.2sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(31, 119, 180);" cx="193.3029662972435" cy="508.31293964649075"><title>Chessington North and Hook
      1.9sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="12.695782628563084" style="fill: rgb(31, 119, 180);" cx="182.23661131609657" cy="528.4532032479173"><title>Chessington South
      7.6sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(31, 119, 180);" cx="212.42401848802237" cy="436.1179089989717"><title>Coombe Hill
      4.4sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(31, 119, 180);" cx="214.89322710470208" cy="455.4369007084119"><title>Coombe Vale
      1.6sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(31, 119, 180);" cx="188.74774576565198" cy="461.9617546512155"><title>Grove
      1.9sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(31, 119, 180);" cx="203.74012011359784" cy="466.2267399896127"><title>Norbiton
      1.3sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(31, 119, 180);" cx="222.89138350353167" cy="495.12578005546527"><title>Old Malden
      1.8sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(31, 119, 180);" cx="233.41680628785411" cy="481.8117711692129"><title>St. James
      2.2sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(31, 119, 180);" cx="182.22540773481109" cy="476.3457957628039"><title>St. Mark's
      1.4sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(31, 119, 180);" cx="186.61424706302307" cy="491.2021977892615"><title>Surbiton Hill
      1.7sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(31, 119, 180);" cx="204.67155937922067" cy="494.7119311860601"><title>Tolworth and Hook Rise
      2.6sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(31, 119, 180);" cx="192.98535120859847" cy="437.15076173684344"><title>Tudor
      1.6sq. km
      Kingston upon Thames</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(174, 199, 232);" cx="350.33054138341015" cy="336.8003389765711"><title>Bishop's
      1.5sq. km
      Lambeth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(174, 199, 232);" cx="335.73175896491136" cy="403.17502551342557"><title>Brixton Hill
      1.1sq. km
      Lambeth</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(174, 199, 232);" cx="324.44347284880325" cy="394.9740884833196"><title>Clapham Common
      1.3sq. km
      Lambeth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(174, 199, 232);" cx="322.54041188250994" cy="375.8299932232921"><title>Clapham Town
      1.1sq. km
      Lambeth</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(174, 199, 232);" cx="343.61153148788287" cy="391.96207912908403"><title>Coldharbour
      1.2sq. km
      Lambeth</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(174, 199, 232);" cx="332.67687975417016" cy="384.23154544451506"><title>Ferndale
      0.9sq. km
      Lambeth</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(174, 199, 232);" cx="374.0012715681322" cy="433.1822045003069"><title>Gipsy Hill
      1.6sq. km
      Lambeth</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(174, 199, 232);" cx="359.0029057604955" cy="394.2170393706436"><title>Herne Hill
      2sq. km
      Lambeth</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(174, 199, 232);" cx="358.75837494295683" cy="433.2307065528979"><title>Knight's Hill
      1.5sq. km
      Lambeth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(174, 199, 232);" cx="340.4075969261332" cy="373.6379004407863"><title>Larkhall
      1.1sq. km
      Lambeth</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(174, 199, 232);" cx="343.500121069859" cy="349.84472161110193"><title>Oval
      1.3sq. km
      Lambeth</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(174, 199, 232);" cx="363.59920596567224" cy="342.7674233964461"><title>Prince's
      1.2sq. km
      Lambeth</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(174, 199, 232);" cx="330.54156209385644" cy="425.63605441392986"><title>St. Leonard's
      1.4sq. km
      Lambeth</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(174, 199, 232);" cx="347.44868427533106" cy="362.53598321099963"><title>Stockwell
      0.9sq. km
      Lambeth</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(174, 199, 232);" cx="341.0880952686508" cy="416.1604989378157"><title>Streatham Hill
      1.3sq. km
      Lambeth</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(174, 199, 232);" cx="335.41817122817923" cy="443.15621986471785"><title>Streatham South
      1.7sq. km
      Lambeth</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(174, 199, 232);" cx="344.3081135233819" cy="430.37859411292436"><title>Streatham Wells
      1.4sq. km
      Lambeth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(174, 199, 232);" cx="324.2297626241324" cy="410.3988235068361"><title>Thornton
      1.1sq. km
      Lambeth</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(174, 199, 232);" cx="359.6487612482321" cy="416.3794287862833"><title>Thurlow Park
      1.5sq. km
      Lambeth</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(174, 199, 232);" cx="349.6035635302758" cy="405.466764582446"><title>Tulse Hill
      1sq. km
      Lambeth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(174, 199, 232);" cx="351.7124139614404" cy="380.9259662999181"><title>Vassall
      1.1sq. km
      Lambeth</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(255, 127, 14);" cx="421.4195785574613" cy="430.2898417092601"><title>Bellingham
      3.1sq. km
      Lewisham</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(255, 127, 14);" cx="450.7565064206059" cy="380.0595165753712"><title>Blackheath
      2.3sq. km
      Lewisham</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 127, 14);" cx="416.7882594139703" cy="373.8565436830887"><title>Brockley
      1.7sq. km
      Lewisham</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(255, 127, 14);" cx="431.1729766195784" cy="411.11110489144113"><title>Catford South
      1.9sq. km
      Lewisham</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 127, 14);" cx="408.08046214543157" cy="393.49224339339503"><title>Crofton Park
      1.7sq. km
      Lewisham</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(255, 127, 14);" cx="451.4111229075409" cy="438.3364178202641"><title>Downham
      2.4sq. km
      Lewisham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 127, 14);" cx="421.4883089844939" cy="350.6420762954555"><title>Evelyn
      1.8sq. km
      Lewisham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 127, 14);" cx="399.58649966088495" cy="407.24352654461387"><title>Forest Hill
      1.8sq. km
      Lewisham</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(255, 127, 14);" cx="456.97252082141864" cy="420.49612688428954"><title>Grove Park
      2.4sq. km
      Lewisham</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(255, 127, 14);" cx="428.8010321444708" cy="383.501147172682"><title>Ladywell
      1.6sq. km
      Lewisham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 127, 14);" cx="456.5134399714248" cy="400.25828076032303"><title>Lee Green
      1.8sq. km
      Lewisham</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 127, 14);" cx="440.73201307067296" cy="394.65077419405964"><title>Lewisham Central
      2.1sq. km
      Lewisham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 127, 14);" cx="408.43166931004777" cy="360.4002491478522"><title>New Cross
      1.8sq. km
      Lewisham</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 127, 14);" cx="414.920908081738" cy="412.420972466879"><title>Perry Vale
      1.7sq. km
      Lewisham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 127, 14);" cx="422.67520405217385" cy="398.2724919569471"><title>Rushey Green
      1.8sq. km
      Lewisham</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 127, 14);" cx="404.30648887170645" cy="424.34630765210784"><title>Sydenham
      1.7sq. km
      Lewisham</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 127, 14);" cx="402.170122180454" cy="379.3766778371086"><title>Telegraph Hill
      1.5sq. km
      Lewisham</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 127, 14);" cx="439.6653465407507" cy="425.2110037583618"><title>Whitefoot
      2.2sq. km
      Lewisham</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(255, 187, 120);" cx="287.27798489990994" cy="452.9156503656191"><title>Abbey
      1.4sq. km
      Merton</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 187, 120);" cx="260.29466557143644" cy="461.99028525428514"><title>Cannon Hill
      2.2sq. km
      Merton</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(255, 187, 120);" cx="295.3057015090245" cy="441.2296374600802"><title>Colliers Wood
      1.1sq. km
      Merton</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(255, 187, 120);" cx="295.82619126980893" cy="470.71224881887656"><title>Cricket Green
      3sq. km
      Merton</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(255, 187, 120);" cx="272.38555861020984" cy="451.7444807449468"><title>Dundonald
      1.2sq. km
      Merton</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(255, 187, 120);" cx="312.828586742598" cy="463.0094890226346"><title>Figge's Marsh
      1.1sq. km
      Merton</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(255, 187, 120);" cx="311.9742919763974" cy="446.9428641905952"><title>Graveney
      0.9sq. km
      Merton</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(255, 187, 120);" cx="260.53057453105976" cy="444.1975444339041"><title>Hillside
      1.2sq. km
      Merton</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(255, 187, 120);" cx="301.5573439824261" cy="454.9161005065344"><title>Lavender Fields
      1.2sq. km
      Merton</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 187, 120);" cx="324.1476518819026" cy="454.00115224177875"><title>Longthornton
      1.5sq. km
      Merton</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 187, 120);" cx="251.7375714968077" cy="483.04612360194807"><title>Lower Morden
      1.8sq. km
      Merton</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 187, 120);" cx="278.4043703840594" cy="465.69566212619895"><title>Merton Park
      1.8sq. km
      Merton</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(255, 187, 120);" cx="327.1312469182927" cy="470.19495276479665"><title>Pollards Hill
      2.2sq. km
      Merton</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 187, 120);" cx="282.2851217472528" cy="482.74043150628114"><title>Ravensbury
      1.8sq. km
      Merton</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(255, 187, 120);" cx="246.98075621160123" cy="451.46185661958367"><title>Raynes Park
      1.9sq. km
      Merton</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 187, 120);" cx="267.03255728604455" cy="477.42212841791195"><title>St. Helier
      1.8sq. km
      Merton</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(255, 187, 120);" cx="280.43526425432435" cy="440.45473749163483"><title>Trinity
      1.1sq. km
      Merton</title></circle><circle class="datum" r="11.466966047949544" style="fill: rgb(255, 187, 120);" cx="245.9457912473421" cy="429.7242981325799"><title>Village
      6.2sq. km
      Merton</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(255, 187, 120);" cx="244.12240058805256" cy="468.2027211909413"><title>West Barnes
      2sq. km
      Merton</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(255, 187, 120);" cx="268.35469308939497" cy="430.27185383271336"><title>Wimbledon Park
      2.3sq. km
      Merton</title></circle><circle class="datum" r="11.559071672545096" style="fill: rgb(44, 160, 44);" cx="502.35621556654434" cy="319.5380840531143"><title>Beckton
      6.3sq. km
      Newham</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(44, 160, 44);" cx="478.95571502041525" cy="292.9862928566693"><title>Boleyn
      0.9sq. km
      Newham</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(44, 160, 44);" cx="450.3380225516294" cy="300.9018234796165"><title>Canning Town North
      2.5sq. km
      Newham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(44, 160, 44);" cx="459.4183009182613" cy="315.80877528128457"><title>Canning Town South
      1.8sq. km
      Newham</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(44, 160, 44);" cx="474.7701676039443" cy="308.864678086645"><title>Custom House
      2.1sq. km
      Newham</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(44, 160, 44);" cx="489.221564499509" cy="286.1835612489584"><title>East Ham Central
      1sq. km
      Newham</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(44, 160, 44);" cx="491.5383335591195" cy="273.90722162233465"><title>East Ham North
      0.9sq. km
      Newham</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(44, 160, 44);" cx="490.0733390626963" cy="301.81113168331285"><title>East Ham South
      1.8sq. km
      Newham</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(44, 160, 44);" cx="462.94719748287076" cy="259.2334204708725"><title>Forest Gate North
      1.2sq. km
      Newham</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(44, 160, 44);" cx="468.8321149599797" cy="271.3212666060087"><title>Forest Gate South
      1.2sq. km
      Newham</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(44, 160, 44);" cx="480.3112033262726" cy="277.55238466775216"><title>Green Street East
      0.7sq. km
      Newham</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(44, 160, 44);" cx="470.82089404384186" cy="284.0156901244636"><title>Green Street West
      0.8sq. km
      Newham</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(44, 160, 44);" cx="493.94819577846033" cy="255.49419103742534"><title>Little Ilford
      1.9sq. km
      Newham</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(44, 160, 44);" cx="481.520531499162" cy="264.6958811275724"><title>Manor Park
      1.3sq. km
      Newham</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(44, 160, 44);" cx="457.93640864167094" cy="286.4424352400792"><title>Plaistow North
      1sq. km
      Newham</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(44, 160, 44);" cx="466.00786080729625" cy="296.6899109112491"><title>Plaistow South
      1.4sq. km
      Newham</title></circle><circle class="datum" r="9.98393191842393" style="fill: rgb(44, 160, 44);" cx="478.61347332402437" cy="328.7732821070133"><title>Royal Docks
      4.7sq. km
      Newham</title></circle><circle class="datum" r="9.437942499331603" style="fill: rgb(44, 160, 44);" cx="432.7672225120185" cy="268.6846604462806"><title>Stratford and New Town
      4.2sq. km
      Newham</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(44, 160, 44);" cx="502.08300992694933" cy="291.8239384229655"><title>Wall End
      1.4sq. km
      Newham</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(44, 160, 44);" cx="448.8967667753818" cy="277.21152957201525"><title>West Ham
      1.3sq. km
      Newham</title></circle><circle class="datum" r="13.505227595779093" style="fill: rgb(152, 223, 138);" cx="524.3206458961542" cy="210.73817477200663"><title>Aldborough
      8.6sq. km
      Redbridge</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(152, 223, 138);" cx="511.6313974660838" cy="229.9909305646078"><title>Barkingside
      1.5sq. km
      Redbridge</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(152, 223, 138);" cx="487.2735309907691" cy="185.63275459125427"><title>Bridge
      2.6sq. km
      Redbridge</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(152, 223, 138);" cx="544.925102554602" cy="221.79455655138537"><title>Chadwell
      1.5sq. km
      Redbridge</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(152, 223, 138);" cx="469.7950841609214" cy="201.88545924516237"><title>Church End
      1.5sq. km
      Redbridge</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(152, 223, 138);" cx="500.65637927713277" cy="217.2987628511314"><title>Clayhall
      2.5sq. km
      Redbridge</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(152, 223, 138);" cx="510.61782442501163" cy="255.9906222545559"><title>Clementswood
      1.3sq. km
      Redbridge</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(152, 223, 138);" cx="490.5689644306739" cy="232.31613885265116"><title>Cranbrook
      2.4sq. km
      Redbridge</title></circle><circle class="datum" r="8.737836866378789" style="fill: rgb(152, 223, 138);" cx="516.7684320877328" cy="185.63468568174076"><title>Fairlop
      3.6sq. km
      Redbridge</title></circle><circle class="datum" r="6.830681290804875" style="fill: rgb(152, 223, 138);" cx="502.84634146953783" cy="199.34921895080925"><title>Fullwell
      2.2sq. km
      Redbridge</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(152, 223, 138);" cx="543.476046628858" cy="246.03331001413636"><title>Goodmayes
      1.6sq. km
      Redbridge</title></circle><circle class="datum" r="10.994870277260807" style="fill: rgb(152, 223, 138);" cx="539.537782346605" cy="178.9593825505509"><title>Hainault
      5.7sq. km
      Redbridge</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(152, 223, 138);" cx="503.29918650765046" cy="267.9918476955664"><title>Loxford
      1.3sq. km
      Redbridge</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(152, 223, 138);" cx="531.3472373149216" cy="256.7143610288861"><title>Mayfield
      1.9sq. km
      Redbridge</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(152, 223, 138);" cx="469.20404230244577" cy="178.24612107554955"><title>Monkhams
      3.1sq. km
      Redbridge</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(152, 223, 138);" cx="520.2021821915854" cy="243.88643043088533"><title>Newbury
      2.1sq. km
      Redbridge</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(152, 223, 138);" cx="483.2513837906195" cy="211.49051427232752"><title>Roding
      2.4sq. km
      Redbridge</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(152, 223, 138);" cx="533.4880036921452" cy="232.99662951714927"><title>Seven Kings
      2.1sq. km
      Redbridge</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(152, 223, 138);" cx="465.6689524026871" cy="217.4590927675729"><title>Snaresbrook
      2sq. km
      Redbridge</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(152, 223, 138);" cx="503.57253116840883" cy="242.88839520079654"><title>Valentines
      1.5sq. km
      Redbridge</title></circle><circle class="datum" r="10.501572952789438" style="fill: rgb(152, 223, 138);" cx="471.16666337856134" cy="241.62218522364267"><title>Wanstead
      5.2sq. km
      Redbridge</title></circle><circle class="datum" r="7.976517259193194" style="fill: rgb(219, 219, 141);" cx="243.46900390143966" cy="360.1959045147419"><title>Barnes
      3sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="11.090897168398959" style="fill: rgb(219, 219, 141);" cx="214.99884608070724" cy="386.73041988256443"><title>East Sheen
      5.8sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(219, 219, 141);" cx="137.47939896466778" cy="437.44891077690545"><title>Fulwell and Hampton Hill
      1.9sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="14.119411924844757" style="fill: rgb(219, 219, 141);" cx="180.7974873765502" cy="416.5600297684216"><title>Ham, Petersham &amp; Richmond Riverside
      9.4sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="12.09698737075789" style="fill: rgb(219, 219, 141);" cx="146.4089496403509" cy="457.89828452367"><title>Hampton
      6.9sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(219, 219, 141);" cx="121.97100818898309" cy="443.27779800377704"><title>Hampton North
      1.9sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(219, 219, 141);" cx="178.74045405718155" cy="447.1227766949962"><title>Hampton Wick
      2.7sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(219, 219, 141);" cx="121.45060455731951" cy="400.67166197021743"><title>Heathfield
      1.9sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="8.737836866378789" style="fill: rgb(219, 219, 141);" cx="205.03973187719316" cy="360.3205019197665"><title>Kew
      3.6sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(219, 219, 141);" cx="227.7585045626435" cy="369.5283615039239"><title>Mortlake and Barnes Common
      1.9sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(219, 219, 141);" cx="194.40266770434525" cy="376.9601712337187"><title>North Richmond
      2.8sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(219, 219, 141);" cx="155.60775868095698" cy="410.8408664074219"><title>St. Margarets &amp; North Twickenham
      2sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="7.567188700408245" style="fill: rgb(219, 219, 141);" cx="181.98344956525534" cy="390.9468574337771"><title>South Richmond
      2.7sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(219, 219, 141);" cx="145.68704811796974" cy="423.59480485850463"><title>South Twickenham
      1.7sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="9.549638014443088" style="fill: rgb(219, 219, 141);" cx="160.93727512221784" cy="435.7904659431313"><title>Teddington
      4.3sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(219, 219, 141);" cx="165.34145295774465" cy="397.3824448874753"><title>Twickenham Riverside
      2sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="7.281530721982325" style="fill: rgb(219, 219, 141);" cx="137.1927196165328" cy="408.56240251693896"><title>West Twickenham
      2.5sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(219, 219, 141);" cx="148.79062636518586" cy="395.9927453619991"><title>Whitton
      1.6sq. km
      Richmond upon Thames</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(214, 39, 40);" cx="373.4887963298055" cy="369.4750033926463"><title>Brunswick Park
      0.9sq. km
      Southwark</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(214, 39, 40);" cx="358.151025077152" cy="369.3127605383915"><title>Camberwell Green
      1sq. km
      Southwark</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(214, 39, 40);" cx="354.4769289041653" cy="313.04532050917027"><title>Cathedrals
      1.8sq. km
      Southwark</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(214, 39, 40);" cx="361.5305969225734" cy="329.0245519698081"><title>Chaucer
      0.8sq. km
      Southwark</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(214, 39, 40);" cx="386.5610461971497" cy="420.24466471663203"><title>College
      3.2sq. km
      Southwark</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(214, 39, 40);" cx="376.44787678505423" cy="389.31543313118516"><title>East Dulwich
      1sq. km
      Southwark</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(214, 39, 40);" cx="375.30315786628165" cy="350.03699272572953"><title>East Walworth
      1.1sq. km
      Southwark</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(214, 39, 40);" cx="366.41987547792024" cy="359.57797017567134"><title>Faraday
      0.9sq. km
      Southwark</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(214, 39, 40);" cx="374.25999464743484" cy="333.5947458303172"><title>Grange
      1.2sq. km
      Southwark</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(214, 39, 40);" cx="392.593551729318" cy="352.7737417948933"><title>Livesey
      1.4sq. km
      Southwark</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(214, 39, 40);" cx="355.84290468917345" cy="353.3196993796758"><title>Newington
      0.8sq. km
      Southwark</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(214, 39, 40);" cx="394.47337539488956" cy="367.07276619482735"><title>Nunhead
      1.3sq. km
      Southwark</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(214, 39, 40);" cx="382.2108774177968" cy="361.2387078835444"><title>Peckham
      0.9sq. km
      Southwark</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(214, 39, 40);" cx="391.61395632459187" cy="392.24061797017424"><title>Peckham Rye
      2.3sq. km
      Southwark</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(214, 39, 40);" cx="396.583867249089" cy="333.4768499582811"><title>Riverside
      1.3sq. km
      Southwark</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(214, 39, 40);" cx="405.0871313097791" cy="345.33546858361115"><title>Rotherhithe
      1.5sq. km
      Southwark</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(214, 39, 40);" cx="385.1318965405025" cy="341.11306253208454"><title>South Bermondsey
      1sq. km
      Southwark</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(214, 39, 40);" cx="365.9566251902235" cy="380.50265663168926"><title>South Camberwell
      1.3sq. km
      Southwark</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(214, 39, 40);" cx="415.5144198619159" cy="333.8370508406416"><title>Surrey Docks
      1.9sq. km
      Southwark</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(214, 39, 40);" cx="384.2942206593315" cy="377.6609805620326"><title>The Lane
      1.4sq. km
      Southwark</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(214, 39, 40);" cx="373.3574235269954" cy="405.32908237436743"><title>Village
      2.8sq. km
      Southwark</title></circle><circle class="datum" r="10.297639501863758" style="fill: rgb(255, 152, 150);" cx="330.99265046431765" cy="506.73533810949647"><title>Beddington North
      5sq. km
      Sutton</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(255, 152, 150);" cx="336.4398452396156" cy="538.1700482927413"><title>Beddington South
      3.1sq. km
      Sutton</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(255, 152, 150);" cx="275.1547311015219" cy="543.4681960529257"><title>Belmont
      2.3sq. km
      Sutton</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(255, 152, 150);" cx="299.7576847002294" cy="525.2131942140727"><title>Carshalton Central
      2sq. km
      Sutton</title></circle><circle class="datum" r="12.271053688281608" style="fill: rgb(255, 152, 150);" cx="306.53965972594426" cy="546.9396758083046"><title>Carshalton South and Clockhouse
      7.1sq. km
      Sutton</title></circle><circle class="datum" r="9.09462895681121" style="fill: rgb(255, 152, 150);" cx="258.34572755191834" cy="532.4906902836631"><title>Cheam
      3.9sq. km
      Sutton</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(255, 152, 150);" cx="250.6654764467522" cy="511.32440882439084"><title>Nonsuch
      1.9sq. km
      Sutton</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 152, 150);" cx="290.4929711759612" cy="495.9250964058111"><title>St. Helier
      1.5sq. km
      Sutton</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(255, 152, 150);" cx="261.76869316815385" cy="496.3507434509225"><title>Stonecot
      2sq. km
      Sutton</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(255, 152, 150);" cx="287.81267028164916" cy="515.0106679522768"><title>Sutton Central
      1.3sq. km
      Sutton</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(255, 152, 150);" cx="276.7409840548131" cy="504.04713562522807"><title>Sutton North
      1.9sq. km
      Sutton</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(255, 152, 150);" cx="284.99549020144525" cy="530.6009022752759"><title>Sutton South
      1.3sq. km
      Sutton</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(255, 152, 150);" cx="273.3791332960796" cy="520.446971570986"><title>Sutton West
      1.8sq. km
      Sutton</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(255, 152, 150);" cx="300.89110656669834" cy="506.76792261330763"><title>The Wrythe
      1.5sq. km
      Sutton</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(255, 152, 150);" cx="313.09112627142804" cy="515.8679850625603"><title>Wallington North
      1.6sq. km
      Sutton</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(255, 152, 150);" cx="320.60978924194274" cy="529.6806344847454"><title>Wallington South
      1.7sq. km
      Sutton</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(255, 152, 150);" cx="306.1631138033072" cy="491.32750969818744"><title>Wandle Valley
      2.1sq. km
      Sutton</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(255, 152, 150);" cx="241.9031362611522" cy="496.92624561421457"><title>Worcester Park
      2sq. km
      Sutton</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(197, 176, 213);" cx="454.3432527803795" cy="249.70636230199352"><title>Cann Hall
      0.9sq. km
      Waltham Forest</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(197, 176, 213);" cx="449.52041482652055" cy="261.8644278990494"><title>Cathall
      1.1sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(197, 176, 213);" cx="436.5507057454676" cy="196.73044585428585"><title>Chapel End
      1.9sq. km
      Waltham Forest</title></circle><circle class="datum" r="8.858364447777886" style="fill: rgb(197, 176, 213);" cx="451.29835406015934" cy="146.59462906491854"><title>Chingford Green
      3.7sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(197, 176, 213);" cx="436.0194987441955" cy="158.2285206268618"><title>Endlebury
      1.9sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(197, 176, 213);" cx="442.443948960751" cy="224.5618502325679"><title>Forest
      2sq. km
      Waltham Forest</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(197, 176, 213);" cx="441.50523277002736" cy="251.40460581982083"><title>Grove Green
      0.9sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(197, 176, 213);" cx="456.4531734696427" cy="192.43654393410444"><title>Hale End and Highams Park
      2.3sq. km
      Waltham Forest</title></circle><circle class="datum" r="7.134413926102518" style="fill: rgb(197, 176, 213);" cx="453.7419195426448" cy="166.80379071737758"><title>Hatch Lane
      2.4sq. km
      Waltham Forest</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(197, 176, 213);" cx="411.215509960592" cy="215.10032884836914"><title>High Street
      3.1sq. km
      Waltham Forest</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(197, 176, 213);" cx="410.65979783067587" cy="193.49617731736984"><title>Higham Hill
      3.2sq. km
      Waltham Forest</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(197, 176, 213);" cx="434.29668839098747" cy="211.95399473940765"><title>Hoe Street
      1.1sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.67363314172609" style="fill: rgb(197, 176, 213);" cx="443.2042476077886" cy="181.17469006220992"><title>Larkswood
      2.1sq. km
      Waltham Forest</title></circle><circle class="datum" r="7.425733448042646" style="fill: rgb(197, 176, 213);" cx="415.5244849237201" cy="236.99855555761687"><title>Lea Bridge
      2.6sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(197, 176, 213);" cx="433.349730148313" cy="238.96948321305328"><title>Leyton
      2sq. km
      Waltham Forest</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(197, 176, 213);" cx="452.0762561234397" cy="236.6887401348215"><title>Leytonstone
      1.3sq. km
      Waltham Forest</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(197, 176, 213);" cx="426.48710432421416" cy="223.98443631528204"><title>Markhouse
      1.5sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(197, 176, 213);" cx="427.1952834051055" cy="175.30238230199325"><title>Valley
      2sq. km
      Waltham Forest</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(197, 176, 213);" cx="423.607172647212" cy="204.01538207266873"><title>William Morris
      1sq. km
      Waltham Forest</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(197, 176, 213);" cx="448.8876490004973" cy="207.9797805785309"><title>Wood Street
      1.9sq. km
      Waltham Forest</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(23, 190, 207);" cx="312.56472733117494" cy="402.8802159074858"><title>Balham
      1.2sq. km
      Wandsworth</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(23, 190, 207);" cx="315.5432779777877" cy="422.6140110699609"><title>Bedford
      1.8sq. km
      Wandsworth</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(23, 190, 207);" cx="276.8251819687854" cy="416.3640316915867"><title>Earlsfield
      1.4sq. km
      Wandsworth</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(23, 190, 207);" cx="255.0444147147687" cy="396.55213539015233"><title>East Putney
      1.6sq. km
      Wandsworth</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(23, 190, 207);" cx="280.041838199991" cy="390.8132556094544"><title>Fairfield
      1.5sq. km
      Wandsworth</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(23, 190, 207);" cx="321.32926473412437" cy="437.00944870077893"><title>Furzedown
      1.4sq. km
      Wandsworth</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(23, 190, 207);" cx="306.9010904385896" cy="434.5535722447488"><title>Graveney
      1sq. km
      Wandsworth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(23, 190, 207);" cx="304.6981802684858" cy="377.03220857026037"><title>Latchmere
      1.1sq. km
      Wandsworth</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(23, 190, 207);" cx="303.67926638770655" cy="413.81359514089974"><title>Nightingale
      1.2sq. km
      Wandsworth</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(23, 190, 207);" cx="301.5832678150908" cy="392.11182106889146"><title>Northcote
      1.7sq. km
      Wandsworth</title></circle><circle class="datum" r="8.238111601491006" style="fill: rgb(23, 190, 207);" cx="329.7075702846229" cy="360.5530972441298"><title>Queenstown
      3.2sq. km
      Wandsworth</title></circle><circle class="datum" r="9.660042121704413" style="fill: rgb(23, 190, 207);" cx="235.87194084689466" cy="402.4350805272011"><title>Roehampton
      4.4sq. km
      Wandsworth</title></circle><circle class="datum" r="5.448998642585311" style="fill: rgb(23, 190, 207);" cx="296.07303395604436" cy="365.79897134216327"><title>St. Mary's Park
      1.4sq. km
      Wandsworth</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(23, 190, 207);" cx="314.37048010237487" cy="385.93235273041716"><title>Shaftesbury
      0.9sq. km
      Wandsworth</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(23, 190, 207);" cx="270.51079566076" cy="402.6242613272485"><title>Southfields
      1.5sq. km
      Wandsworth</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(23, 190, 207);" cx="265.74114128081595" cy="384.44053886748486"><title>Thamesfield
      1.9sq. km
      Wandsworth</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(23, 190, 207);" cx="295.2565783205436" cy="426.03240573746314"><title>Tooting
      1.6sq. km
      Wandsworth</title></circle><circle class="datum" r="7.706047781696732" style="fill: rgb(23, 190, 207);" cx="289.5699324927166" cy="405.02520786546916"><title>Wandsworth Common
      2.8sq. km
      Wandsworth</title></circle><circle class="datum" r="6.004504056582629" style="fill: rgb(23, 190, 207);" cx="258.10673317669637" cy="412.0908527583669"><title>West Hill
      1.7sq. km
      Wandsworth</title></circle><circle class="datum" r="6.178583701118254" style="fill: rgb(23, 190, 207);" cx="244.4558133417656" cy="384.5556962866805"><title>West Putney
      1.8sq. km
      Wandsworth</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(140, 86, 75);" cx="283.665399557697" cy="283.5425854942066"><title>Abbey Road
      1.1sq. km
      Westminster</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(140, 86, 75);" cx="283.21133147588677" cy="310.3210013791017"><title>Bayswater
      0.5sq. km
      Westminster</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(140, 86, 75);" cx="309.71504873023156" cy="312.8570468048347"><title>Bryanston and Dorset Square
      0.7sq. km
      Westminster</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="315.5835165768043" cy="354.1629141801981"><title>Churchill
      0.6sq. km
      Westminster</title></circle><circle class="datum" r="2.9126122887929298" style="fill: rgb(140, 86, 75);" cx="301.89855779893685" cy="296.99921396862493"><title>Church Street
      0.4sq. km
      Westminster</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(140, 86, 75);" cx="274.3800663933475" cy="304.65241861370424"><title>Harrow Road
      0.5sq. km
      Westminster</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(140, 86, 75);" cx="299.2181811743085" cy="308.4128657031488"><title>Hyde Park
      1sq. km
      Westminster</title></circle><circle class="datum" r="8.737836866378789" style="fill: rgb(140, 86, 75);" cx="315.5889251555704" cy="327.9023989526628"><title>Knightsbridge and Belgravia
      3.6sq. km
      Westminster</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="291.2597639496485" cy="317.55424677793775"><title>Lancaster Gate
      0.6sq. km
      Westminster</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="293.7259448037487" cy="290.6261122877863"><title>Little Venice
      0.6sq. km
      Westminster</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="280.3482706772921" cy="295.6246622462581"><title>Maida Vale
      0.6sq. km
      Westminster</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(140, 86, 75);" cx="312.6538466584684" cy="300.72537439239835"><title>Marylebone High Street
      1sq. km
      Westminster</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="272.63884671199764" cy="288.70289236534893"><title>Queen's Park
      0.6sq. km
      Westminster</title></circle><circle class="datum" r="6.98419891489057" style="fill: rgb(140, 86, 75);" cx="306.60124107813886" cy="283.91877302540996"><title>Regent's Park
      2.3sq. km
      Westminster</title></circle><circle class="datum" r="8.615623338867676" style="fill: rgb(140, 86, 75);" cx="338.5868167113407" cy="322.9347431929156"><title>St. James's
      3.5sq. km
      Westminster</title></circle><circle class="datum" r="2.9126122887929298" style="fill: rgb(140, 86, 75);" cx="333.0532608090842" cy="346.0358644554792"><title>Tachbrook
      0.4sq. km
      Westminster</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(140, 86, 75);" cx="329.27999509511056" cy="336.43227523548245"><title>Vincent Square
      0.7sq. km
      Westminster</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(140, 86, 75);" cx="321.28840068043803" cy="344.5799241299784"><title>Warwick
      0.6sq. km
      Westminster</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(140, 86, 75);" cx="289.6721149957375" cy="301.39261716008775"><title>Westbourne
      0.7sq. km
      Westminster</title></circle><circle class="datum" r="6.51279906984224" style="fill: rgb(140, 86, 75);" cx="323.955314769815" cy="310.66367803415295"><title>West End
      2sq. km
      Westminster</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(148, 103, 189);" cx="400.7399122645338" cy="305.6057665986871"><title>Bethnal Green
      1.2sq. km
      Tower Hamlets</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(148, 103, 189);" cx="445.84442820400614" cy="331.1111741829791"><title>Blackwall and Cubitt Town
      1.9sq. km
      Tower Hamlets</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(148, 103, 189);" cx="421.96343452953016" cy="285.0494883739293"><title>Bow East
      1.9sq. km
      Tower Hamlets</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(148, 103, 189);" cx="410.02851637198376" cy="294.97859883419375"><title>Bow West
      1.3sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(148, 103, 189);" cx="432.1837084723499" cy="294.23440834703825"><title>Bromley North
      0.6sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(148, 103, 189);" cx="436.37734752124453" cy="304.4996163685158"><title>Bromley South
      0.7sq. km
      Tower Hamlets</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(148, 103, 189);" cx="431.1247325089516" cy="337.8974340140106"><title>Canary Wharf
      1.6sq. km
      Tower Hamlets</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(148, 103, 189);" cx="440.4274264297953" cy="350.225439649367"><title>Island Gardens
      1.5sq. km
      Tower Hamlets</title></circle><circle class="datum" r="5.250786476394719" style="fill: rgb(148, 103, 189);" cx="443.1592296956827" cy="315.748597492541"><title>Lansbury
      1.3sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(148, 103, 189);" cx="418.7193007139357" cy="321.42760692106435"><title>Limehouse
      0.5sq. km
      Tower Hamlets</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(148, 103, 189);" cx="427.4718020138349" cy="313.18902614517725"><title>Mile End
      1.2sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(148, 103, 189);" cx="433.41529043161216" cy="324.4806799439941"><title>Poplar
      0.7sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(148, 103, 189);" cx="420.53941954943144" cy="302.42387704077794"><title>St Dunstan's
      0.7sq. km
      Tower Hamlets</title></circle><circle class="datum" r="5.640249444227042" style="fill: rgb(148, 103, 189);" cx="405.4826168466048" cy="321.62953790854044"><title>St Katharine's and Wapping
      1.5sq. km
      Tower Hamlets</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(148, 103, 189);" cx="398.95946305369296" cy="286.6483799325939"><title>St Peter's
      1.1sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(148, 103, 189);" cx="412.3949560774819" cy="310.3790609487204"><title>Shadwell
      0.6sq. km
      Tower Hamlets</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(148, 103, 189);" cx="385.75328621400314" cy="307.5710637144214"><title>Spitalfields and Banglatown
      0.9sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(148, 103, 189);" cx="393.83727477735033" cy="315.9861183763292"><title>Stepney Green
      0.6sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(148, 103, 189);" cx="391.4031552294283" cy="296.72164481150884"><title>Weavers
      0.7sq. km
      Tower Hamlets</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(148, 103, 189);" cx="386.1077102495815" cy="325.38289755900485"><title>Whitechapel
      1sq. km
      Tower Hamlets</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(23, 190, 207);" cx="366.35687918587195" cy="241.25105926837352"><title>Brownswood
      0.5sq. km
      Hackney</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(23, 190, 207);" cx="385.8670151655558" cy="231.34587306608776"><title>Cazenove
      0.7sq. km
      Hackney</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(23, 190, 207);" cx="370.84093979404173" cy="252.0827176359726"><title>Clissold
      1sq. km
      Hackney</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(23, 190, 207);" cx="384.34050624746527" cy="266.9275942616954"><title>Dalston
      0.5sq. km
      Hackney</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(23, 190, 207);" cx="378.32689141820487" cy="275.87126976384536"><title>De Beauvoir
      0.6sq. km
      Hackney</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(23, 190, 207);" cx="393.767051610903" cy="260.6791321475222"><title>Hackney Central
      0.8sq. km
      Hackney</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(23, 190, 207);" cx="388.6073036547891" cy="249.22684527833817"><title>Hackney Downs
      1sq. km
      Hackney</title></circle><circle class="datum" r="5.8252245775858595" style="fill: rgb(23, 190, 207);" cx="415.75682116417755" cy="261.0159327998853"><title>Hackney Wick
      1.6sq. km
      Hackney</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(23, 190, 207);" cx="385.43662674450866" cy="285.4495529575807"><title>Haggerston
      0.9sq. km
      Hackney</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(23, 190, 207);" cx="403.4929620141986" cy="267.8361986360241"><title>Homerton
      0.8sq. km
      Hackney</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(23, 190, 207);" cx="379.1145333003496" cy="296.8732592178085"><title>Hoxton East and Shoreditch
      1sq. km
      Hackney</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(23, 190, 207);" cx="371.74691893809023" cy="287.4098437965439"><title>Hoxton West
      0.6sq. km
      Hackney</title></circle><circle class="datum" r="6.347891314281542" style="fill: rgb(23, 190, 207);" cx="404.0729246409802" cy="250.5572027560078"><title>King's Park
      1.9sq. km
      Hackney</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(23, 190, 207);" cx="395.78018358923777" cy="238.15383417074145"><title>Lea Bridge
      1.1sq. km
      Hackney</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(23, 190, 207);" cx="392.89953628320046" cy="274.8500861367035"><title>London Fields
      1sq. km
      Hackney</title></circle><circle class="datum" r="2.9126122887929298" style="fill: rgb(23, 190, 207);" cx="380.7714975702761" cy="257.5728426184421"><title>Shacklewell
      0.4sq. km
      Hackney</title></circle><circle class="datum" r="5.044792466938829" style="fill: rgb(23, 190, 207);" cx="397.0279535316432" cy="224.47894965833092"><title>Springfield
      1.2sq. km
      Hackney</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(23, 190, 207);" cx="375.48994521624235" cy="227.17266076473152"><title>Stamford Hill West
      0.7sq. km
      Hackney</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(23, 190, 207);" cx="378.2009079824786" cy="241.12962994834552"><title>Stoke Newington
      1sq. km
      Hackney</title></circle><circle class="datum" r="4.119055800745503" style="fill: rgb(23, 190, 207);" cx="409.1161777932273" cy="278.62721402809007"><title>Victoria
      0.8sq. km
      Hackney</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(23, 190, 207);" cx="363.92997321693673" cy="223.85509402219066"><title>Woodberry Down
      0.9sq. km
      Hackney</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(158, 218, 229);" cx="275.94989478497945" cy="337.8206055477456"><title>Abingdon
      0.6sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="4.830021060852206" style="fill: rgb(158, 218, 229);" cx="299.62133311282804" cy="334.9236063204549"><title>Brompton and Hans Town
      1.1sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(158, 218, 229);" cx="279.80564123550107" cy="321.59792226694765"><title>Campden
      1sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(158, 218, 229);" cx="288.46704631616416" cy="354.9348415443492"><title>Chelsea Riverside
      0.7sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(158, 218, 229);" cx="264.17166331207727" cy="308.07558795254835"><title>Colville
      0.5sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(158, 218, 229);" cx="296.33979036134156" cy="346.7536757358208"><title>Courtfield
      0.6sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="4.368918433189394" style="fill: rgb(158, 218, 229);" cx="257.0198295733771" cy="289.9865199345894"><title>Dalgarno
      0.9sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(158, 218, 229);" cx="279.90187040079627" cy="347.8766963742739"><title>Earl's Court
      0.5sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(158, 218, 229);" cx="266.30477839471047" cy="297.4776574948745"><title>Golborne
      0.6sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(158, 218, 229);" cx="268.4487244410957" cy="328.2702802182421"><title>Holland
      1sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(158, 218, 229);" cx="261.87578284743086" cy="318.42430642013164"><title>Norland
      0.5sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(158, 218, 229);" cx="253.60779105678472" cy="311.412854135011"><title>Notting Dale
      0.6sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="2.9126122887929298" style="fill: rgb(158, 218, 229);" cx="271.4053032904942" cy="314.5513586304652"><title>Pembridge
      0.4sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.567206963051259" style="fill: rgb(158, 218, 229);" cx="289.55731644903545" cy="328.5238327460523"><title>Queen's Gate
      0.6sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(158, 218, 229);" cx="287.37224770848246" cy="339.7073422549942"><title>Redcliffe
      0.7sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="4.605244386790886" style="fill: rgb(158, 218, 229);" cx="309.28810242410583" cy="344.01543758649575"><title>Royal Hospital
      1sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.25639953492112" style="fill: rgb(158, 218, 229);" cx="256.4829839606461" cy="301.2970126994357"><title>St Helen's
      0.5sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="3.853023890848366" style="fill: rgb(158, 218, 229);" cx="303.9892265495465" cy="355.2264807554329"><title>Stanley
      0.7sq. km
      Kensington and Chelsea</title></circle><circle class="datum" r="8.10836945214103" style="fill: rgb(219, 219, 141);" cx="372.02368391716476" cy="316.67378150168895"><title>City of London
      3.1sq. km
      City of London</title></circle><circle cx="30" cy="20" class="radius key" r="2.9126122887929298" style="fill: none; stroke: black;"></circle><circle cx="30" cy="60" class="radius key" r="24.8" style="fill: none; stroke: black;"></circle>
      <text alignment-baseline="middle" class="radius key" x="60" y="20">0.4sq. km</text>
      <text alignment-baseline="middle" class="radius key" x="60" y="60">29sq. km</text>
  </svg>
</div>

# What you're looking at

London is broken down into 35 boroughs, 630 electoral wards, or 3000ish postcodes. I chose to visualise wards because although there is a huge amount of per-borough data kicking around, having only 35 bubbles doesn't provide quite the effect I was looking for, and conversely, although having each postcode would be very beautiful and granular, it would be very slow to render for all but the most grunty CPUs. Per-ward data seems to strike a good balance of granularity, data availability, and performance.

Each ward tries to stay close to its geographical location, but can get pushed away as the wards around it grow or shrink - the idea is to give a broad sense of geography, so I think it's ok that they can get slightly mixed up.

# Limitations and choices

Working with the data at hand meant being aware of certain limitations of the data set and my ability to present it. For instance, the first version of this used a data set from 2012, which I subsequently was unable to reconcile with the 2016 Mayoral Election results because of the adjustment of certain wards in 2014. This meant becoming aware of exactly which year and which ward boundaries each dataset I looked at corresponded to. It also means that in this visualisation, the data for pre-2014 has been massaged into a post-2014 shape (this was handled at the source by GLA, not by me, thankfully!).

The locations were generated by taking the entire ONS London Postcode database, grouping by ward, and averaging the postcodes. This is OK for a relatively coarse application like this, but for more precise work a more carefully considered dataset would probably make sense.

I'm also aware that every act of communication exposes the author's biases and conceptions, whether intentionally or not: for instance, when exposing a set of data as sizes, I have to decide both the minimum and maximum sizes, as well as the scaling function. Data can look much more dramatic with one set of choices than with another:

<img src="/res/london-vis/prices_linear_scale.PNG" title="Prices, scaled linearly" style="width:40%;float:left"/>
<img src="/res/london-vis/prices_sqrt_scale.PNG" title="Prices, scaled by square root" style="width:40%;float:left"/>
<div style="clear:bqth"/>

Similarly, choosing which colours to use to present data about ethnic minority population or socially rented housing could appear to make value judgements about the data presented - for instance, does red signify high or low or good or bad?

# Technology

To draw this data, I used d3.js force layout with the wards as nodes. Each ward has three competing forces acting on it: the first is a spring-like force pulling it towards its geographical location, and the second is a very strong short-range force attempting to prevent it overlapping its neighbours, and the third is a charge force which distributes the wards slightly more evenly across space. Choosing this set of forces allows a sense of which part of London is which, whilst allowing different areas to grow and shrink in an organic way. It does mean that wards can get a little mixed up, so the idea is only to give a broad sense of geography.

The data is served as a single SQLite file which is interrogated using SQL.js. This allows a lot of flexibility in loading in data - the ability to do joins and aggregations on-the-fly saves a lot of code and memory, and it means that whilst developing I was able to load in table as and when I wanted to try a new data shape.