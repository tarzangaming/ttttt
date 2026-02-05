/**
 * Script to:
 * 1. Create cities-zipcodes.json from the provided city,zipcode list
 * 2. Update locations.json with zipcodes for matching locations
 */

const fs = require('fs');
const path = require('path');

// City name + zipcode pairs from user (format: "City, ZIPCODE")
// Entries without zipcodes are skipped
const CITY_ZIP_LIST = `
New York, 10286
Houston, 99694
San Antonio, 87832
Dallas, 97338
Fort Worth, 76199
Austin, 89310
El Paso, 88595
Los Angeles, 90189
San Diego, 92199
San Francisco, 94188
Addison, 75001
Allen, 75013
Alvin, 77512
Angleton, 77516
Anna, 75409
Arlington, 98223
Azle, 76098
Bacliff, 77518
Balch Springs, 75180
Bastrop, 78602
Baytown, 77523
Bedford, 83112
Bellaire, 77402
Belton, 76513
Bonham, 75418
Bryan, 77808
Burleson, 76097
Carrollton, 75011
Cedar Hill, 75106
Cedar Park, 78630
Celina, 75009
Channelview, 77530
Cleburne, 76033
College Station, 77845
Colleyville, 76034
Commerce, 75429
Conroe, 77385
Coppell, 75099
Copperas Cove, 76522
Corsicana, 75151
Crowley, 81033
Dayton, 99328
Deer Park, 99006
Denison, 75021
Denton, 76210
Desoto, 75123
Dickinson, 77539
Duncanville, 75138
Elgin, 97827
Ennis, 75120
Euless, 76040
Fate, 75132
Flower Mound, 75028
Forney, 75126
Fort Hood, 76544
Fresno, 93888
Friendswood, 77549
Frisco, 80443
Fulshear, 77441
Gainesville, 76241
Galena Park, 77547
Galveston, 77555
Garland, 84312
Gatesville, 76599
Georgetown, 95634
Grand Prairie, 75054
Grapevine, 76099
Greenville, 95947
Haltom City, 76117
Harker Heights, 76548
Helotes, 78023
Hewitt, 76643
Hillsboro, 97129
Humble, 77396
Huntsville, 84317
Hurst, 76054
Hutto, 78634
Irving, 75064
Joshua, 76058
Katy, 77494
Keller, 99140
Kennedale, 76060
Killeen, 76549
La Marque, 77568
La Porte, 77572
Lancaster, 93586
League City, 77574
Leander, 78646
Lewisville, 83431
Liberty, 77575
Little Elm, 75068
Manor, 78653
Mansfield, 98830
Manvel, 77578
Marshall, 99585
Mckinney, 75072
Melissa, 75454
Mesquite, 89034
Midlothian, 76065
Mineral Wells, 76068
Missouri City, 77489
North Richland Hills, 76182
Pasadena, 91199
Pearland, 77588
Pflugerville, 78691
Plano, 75094
Princeton, 97721
Prosper, 75078
Red Oak, 75154
Richardson, 75085
Richmond, 94850
Roanoke, 76262
Rockwall, 75087
Rosenberg, 77471
Round Rock, 86547
Rowlett, 75089
Royse City, 75189
Sachse, 75048
Sanger, 93657
Santa Fe, 87594
Seabrook, 77586
Seagoville, 75159
Sherman, 75092
South Houston, 77587
Southlake, 76092
Spring, 77393
Stafford, 77497
Sugar Land, 77498
Sulphur Springs, 75483
Taylor, 85939
Temple, 76508
Terrell, 75161
Texas City, 77592
The Colony, 75056
Tomball, 77377
Waxahachie, 75168
Weatherford, 76088
Webster, 77598
Woodway, 76712
Wylie, 75098
Alameda, 94502
Alhambra, 91899
Aliso Viejo, 92698
Altadena, 91003
Anaheim, 92899
Antelope, 97001
Antioch, 94531
Arcadia, 91077
Azusa, 91702
Baldwin Park, 91706
Bell Gardens, 90205
Bellflower, 90707
Belmont, 99104
Benicia, 94510
Berkeley, 94720
Beverly Hills, 90213
Brea, 92823
Brentwood, 94513
Buena Park, 90624
Burbank, 99323
Burlingame, 94011
Camarillo, 93012
Campbell, 95011
Carlsbad, 92018
Carmichael, 95609
Carson, 98610
Castro Valley, 94552
Cerritos, 90703
Chico, 95976
Chino, 91710
Chino Hills, 91709
Chula Vista, 91921
Citrus Heights, 95621
Claremont, 91711
Compton, 90224
Concord, 94529
Corona, 92883
Costa Mesa, 92628
Covina, 91724
Culver City, 90232
Cupertino, 95015
Cypress, 90630
Daly City, 94017
Dana Point, 92629
Danville, 99121
Davis, 95618
Diamond Bar, 91765
Downey, 90242
Dublin, 94568
El Cajon, 92022
El Cerrito, 94530
El Dorado Hills, 95762
El Monte, 91735
Elk Grove, 95759
Encinitas, 92024
Escondido, 92046
Fair Oaks, 95628
Fairfield, 99012
Fallbrook, 92088
Folsom, 95763
Fontana, 92337
Fountain Valley, 92728
Fremont, 94555
Fullerton, 92838
Galt, 95632
Garden Grove, 92846
Gardena, 90249
Gilroy, 95021
Glendale, 97442
Glendora, 91741
Hacienda Heights, 91745
Hawthorne, 90251
Hayward, 94557
Hercules, 94547
Hollister, 95024
Huntington Beach, 92649
Huntington Park, 90255
Imperial Beach, 91933
Inglewood, 90312
Irvine, 92697
Jurupa Valley, 92509
La Habra, 90633
La Mesa, 91944
La Mirada, 90639
La Puente, 91749
La Verne, 91750
Ladera Ranch, 92694
Lafayette, 97127
Laguna Hills, 92654
Laguna Niguel, 92677
Lake Forest, 92630
Lakewood, 98499
Lathrop, 95330
Lawndale, 90260
Lemon Grove, 91946
Lincoln, 99147
Livermore, 94551
Lodi, 95242
Long Beach, 98631
Los Altos, 94024
Los Gatos, 95033
Lynwood, 90262
Manhattan Beach, 90267
Manteca, 95337
Martinez, 94553
Maywood, 90270
Menlo Park, 94026
Milpitas, 95036
Mission Viejo, 92692
Modesto, 95397
Monrovia, 91017
Montclair, 91763
Montebello, 90640
Monterey, 93944
Monterey Park, 91756
Moorpark, 93021
Morgan Hill, 95038
Mountain View, 96771
Napa, 94581
National City, 91951
Newark, 94560
Newport Beach, 92663
Norco, 92860
North Highlands, 95660
Norwalk, 90652
Novato, 94998
Oakland, 97462
Oakley, 94561
Oceanside, 97134
Ontario, 97914
Orange, 92869
Orangevale, 95662
Oxnard, 93036
Pacifica, 94044
Palmdale, 93599
Palo Alto, 94309
Paramount, 90723
Petaluma, 94999
Pico Rivera, 90662
Pittsburg, 94565
Placentia, 92871
Pleasant Hill, 97455
Pleasanton, 94588
Pomona, 91769
Poway, 92074
Rancho Cordova, 95742
Rancho Cucamonga, 91739
Rancho Palos Verdes, 90275
Rancho Santa Margarita, 92688
Redondo Beach, 90278
Redwood City, 94065
Rialto, 92377
Riverbank, 95367
Riverside, 98849
Rocklin, 95765
Rohnert Park, 94928
Rosemead, 91772
Roseville, 95747
Rowland Heights, 91748
Sacramento, 95899
Salinas, 93915
San Bernardino, 92427
San Bruno, 94066
San Carlos, 94070
San Clemente, 92674
San Dimas, 91773
San Gabriel, 91778
San Jose, 95196
San Juan Capistrano, 92693
San Leandro, 94579
San Lorenzo, 94580
San Marcos, 92096
San Mateo, 94497
San Pablo, 94806
San Rafael, 94915
San Ramon, 94583
Santa Ana, 92799
Santa Clara, 95056
Santa Clarita, 91390
Santa Cruz, 95065
Santa Monica, 90411
Santa Paula, 93061
Santa Rosa, 95409
Santee, 92072
Saratoga, 95071
Seal Beach, 90740
Seaside, 97138
Simi Valley, 93099
Soledad, 93960
South Gate, 90280
South Pasadena, 91031
South San Francisco, 94083
Spring Valley, 91979
Stanton, 90680
Stockton, 95297
Suisun City, 94585
Sunnyvale, 94089
Temple City, 91780
Thousand Oaks, 91362
Torrance, 90510
Tracy, 95391
Tustin, 92782
Union City, 94587
Upland, 91786
Vacaville, 95696
Vallejo, 94592
Vista, 92085
Walnut, 91789
Walnut Creek, 94598
Watsonville, 95077
West Covina, 91793
West Hollywood, 90069
West Sacramento, 95799
Westminster, 92685
Whittier, 99693
Windsor, 95492
Woodland, 98674
Yorba Linda, 92887
Yuba City, 95993
Adams, 97810
Afton, 83110
Albertson, 28508
Alpine, 91903
Altmar, 13302
Alton, 84710
Amagansett, 11930
Amawalk, 10501
Amityville, 11701
Apalachin, 13732
Aquebogue, 11931
Ardsley, 10502
Armonk, 10504
Aurora, 97002
Ava, 65608
Babylon, 11702
Bainbridge, 46105
Baldwin, 70514
Baldwinsville, 13027
Barton, 72312
Bayport, 55003
Bayside, 95524
Bayville, 11709
Bedford, 83112
Bellerose, 11426
Belleville, 72824
Bellmore, 11710
Bellona, 14415
Bellport, 11713
Berkshire, 13736
Bethpage, 37022
Binghamton, 13905
Blauvelt, 10913
Blodgett Mills, 13308
Bloomfield, 87413
Blossvale, 13308
Bohemia, 11716
Boonville, 95415
Bouckville, 13310
Breesport, 14816
Brentwood, 94513
Brewerton, 13029
Bridgehampton, 11932
Bridgeport, 98813
Bridgewater, 57319
Brightwaters, 11718
Bronx, 10475
Bronxville, 10708
Brookfield, 64628
Brookhaven, 39603
Brooktondale, 14817
Buchanan, 58420
Burdett, 67523
Calverton, 20138
Camden, 75934
Camillus, 13031
Canandaigua, 14424
Canastota, 13032
Candor, 27229
Cato, 13033
Cayuga, 75832
Cayuta, 14824
Cazenovia, 53924
Cedarhurst, 11516
Centereach, 11720
Centerport, 19516
Chadwicks, 13319
Chappaqua, 10514
Chenango Forks, 13746
Chester, 96020
Chittenango, 13037
Cicero, 60804
Cincinnatus, 13040
Clay, 42404
Cleveland, 87715
Clifton Springs, 14432
Clinton, 98236
Clyde, 79510
Cold Spring Harbor, 11724
Commack, 11725
Congers, 10920
Conklin, 49403
Constableville, 13325
Constantia, 13044
Copiague, 11726
Coram, 59913
Corona, 92883
Cortland, 68331
Crompond, 10517
Cutchogue, 11935
Deansboro, 13328
Delphi Falls, 13052
Dresden, 67635
Dryden, 98821
Durhamville, 13054
Earlville, 60518
East Hampton, 01027
East Meadow, 11554
East Northport, 11731
East Norwich, 11732
East Quogue, 11942
East Rochester, 14445
East Rockaway, 11518
East Setauket, 11733
East Syracuse, 13057
Eastchester, 10709
Eastport, 83826
Eaton, 80615
Edmeston, 13335
Elbridge, 13060
Ellisburg, 13636
Elmhurst, 60126
Elmont, 11003
Elmsford, 10523
Endicott, 99125
Erieville, 13061
Erin, 37061
Etna, 96027
Fabius, 13063
Fairport, 14450
Farmingdale, 11737
Farmington, 99128
Farmingville, 11738
Fayette, 84630
Fayetteville, 78940
Floral Park, 11001
Frankfort, 66427
Franklin Square, 11010
Freeport, 77542
Freeville, 13068
Fulton, 95439
Garnerville, 10923
Garrattsville, 13342
Garrison, 84728
Geneva, 83238
Genoa, 89411
Georgetown, 95634
Gilbertsville, 42044
Glen Cove, 11542
Glen Head, 11545
Glen Oaks, 11004
Goshen, 93227
Granite Springs, 10527
Great Neck, 11021
Great River, 11739
Greene, 50636
Greenlawn, 11740
Greenport, 11944
Greenvale, 11548
Greenwood Lake, 10925
Groton, 57445
Guilford, 64457
Hall, 59837
Hamilton, 98255
Hannibal, 63401
Harford, 18823
Harpursville, 13787
Harriman, 37748
Harrison, 83833
Hartsdale, 10530
Hastings, 73548
Hauppauge, 11788
Haverstraw, 10927
Hawthorne, 90251
Hector, 72843
Hempstead, 77445
Henderson, 89077
Hewlett, 11557
Hicksville, 43526
Hillburn, 10931
Himrod, 14842
Holbrook, 86025
Hollis, 73550
Holtsville, 11742
Homer, 99603
Honeoye, 14471
Hubbardsville, 13355
Huntington, 97907
Huntington Station, 11746
Interlaken, 14847
Inwood, 51240
Irvington, 62848
Island Park, 11558
Islandia, 11749
Islip, 11751
Ithaca, 68033
Jackson Heights, 11372
Jacksonville, 97530
Jamaica, 50128
Jamesport, 64648
Jamesville, 27846
Jericho, 11853
Johnson City, 13790
Jordan, 59337
Jordanville, 13361
Kanona, 14856
Katonah, 10536
King Ferry, 13081
Kings Park, 11754
Kirkville, 52566
Kirkwood, 95646
LaFayette, 97127
Lacona, 50139
Lake Grove, 11755
Lansing, 66043
Larchmont, 10538
Laurel, 68745
Lawrence, 68957
Leonardsville, 13364
Levittown, 19058
Lindenhurst, 11757
Lisle, 60532
Little Neck, 11363
Little York, 13087
Liverpool, 77577
Locke, 13092
Lockwood, 93932
Locust Valley, 11560
Lodi, 95242
Long Beach, 98631
Long Island City, 11101
Lorraine, 67459
Lowman, 83637
Lowville, 13367
Lyons, 97358
Lyons Falls, 13368
Macedon, 14502
Madison, 95653
Maine, 13802
Mallory, 25634
Malverne, 11565
Mamaroneck, 10543
Manhasset, 11030
Manlius, 61338
Mannsville, 73447
Manorville, 16238
Marathon, 79842
Marcellus, 49067
Marcy, 13403
Marietta, 75566
Marion, 78124
Martville, 13111
Maryknoll, 10545
Masonville, 80541
Maspeth, 11378
Massapequa, 11758
Mastic, 11950
Mattituck, 11952
Maybrook, 12543
McDonough, 30253
McLean, 79057
Medford, 97504
Melville, 71353
Memphis, 79245
Mendon, 84325
Meridian, 95957
Merrick, 11566
Mexico, 65265
Middle Island, 11953
Middle Village, 11379
Middletown, 95461
Mill Neck, 11765
Miller Place, 11764
Millport, 35576
Millwood, 42762
Mineola, 75773
Minetto, 13115
Minoa, 13116
Mohegan Lake, 10547
Monroe, 98272
Monsey, 10952
Montauk, 11954
Montezuma, 87731
Montgomery, 77356
Montour Falls, 14865
Montrose, 91021
Moravia, 52571
Moriches, 11955
Morris, 74445
Morrisville, 65710
Mottville, 13119
Mount Kisco, 10549
Mount Sinai, 11766
Mount Upton, 13809
Mount Vernon, 10550
Munnsville, 13409
Nanuet, 10954
Nedrow, 13120
Nesconset, 11767
New Berlin, 62670
New City, 10956
New Hampton, 10958
New Hartford, 13413
New Hyde Park, 11040
New Lisbon, 53550
New Rochelle, 10801
New Suffolk, 11956
New Windsor, 12553
New Woodstock, 13122
New York Mills, 13417
Newark, 94560
Newark Valley, 13811
Newburgh, 47630
Newfield, 14867
Nichols, 54152
Nineveh, 46164
North Babylon, 11703
North Bay, 13123
North Rose, 14516
North Salem, 10560
Northport, 99157
Norwich, 67118
Nunda, 57050
Nyack, 10960
Oakdale, 95361
Oakland Gardens, 11364
Ocean Beach, 11770
Oceanside, 97134
Odessa, 99159
Old Bethpage, 11804
Old Westbury, 11568
Oneida, 72369
Orangeburg, 29118
Orient, 99160
Oriskany, 24130
Oriskany Falls, 13425
Ossining, 10562
Oswego, 67356
Otego, 13825
Otisville, 48463
Ouaquaga, 13826
Ovid, 80744
Owego, 13827
Oxford, 72565
Oyster Bay, 11771
Ozone Park, 11417
Palisades, 98845
Parish, 13131
Patchogue, 11772
Peconic, 11958
Peekskill, 10566
Pelham, 37366
Pennellville, 13132
Peterboro, 13134
Phelps, 54554
Phoenix, 97535
Piermont, 10968
Pierrepont Manor, 13674
Pine Island, 10969
Pitcher, 13136
Pittsford, 49271
Plainview, 79073
Pleasantville, 50225
Plymouth, 99346
Point Lookout, 11569
Pomona, 91769
Pompey, 13138
Port Byron, 13140
Port Chester, 10573
Port Crane, 13833
Port Gibson, 14544
Port Jefferson, 11777
Port Jefferson Station, 11776
Port Jervis, 12771
Port Washington, 11050
Pound Ridge, 10576
Preble, 46782
Pulaski, 62976
Pulteney, 14874
Purchase, 10577
Purdys, 10578
Queens Village, 11428
Quogue, 11959
Red Creek, 13143
Redfield, 72132
Remsenburg, 11960
Richford, 13835
Richland, 99354
Richmond Hill, 11418
Ridge, 20680
Ridgewood, 11386
Riverhead, 11901
Rochester, 98579
Rock Stream, 14878
Rock Tavern, 12575
Rockaway Park, 11694
Rockville Centre, 11570
Rocky Point, 11778
Rome, 61562
Romulus, 48174
Ronkonkoma, 11779
Roosevelt, 99356
Rose, 74364
Rosedale, 70772
Roslyn, 98941
Roslyn Heights, 11577
Rushville, 69360
Rye, 81069
Sag Harbor, 11963
Sagaponack, 11962
Saint Albans, 11412
Saint James, 11780
Salisbury Mills, 12577
Sandy Creek, 13145
Sangerfield, 13455
Sauquoit, 13456
Savannah, 64485
Sayville, 11782
Scarsdale, 10583
Scottsville, 75688
Sea Cliff, 11579
Seaford, 23696
Selden, 67757
Seneca Falls, 13148
Sherburne, 13460
Sherrill, 72152
Shirley, 72153
Shoreham, 11786
Shrub Oak, 10588
Sidney, 76474
Sidney Center, 13839
Skaneateles, 13152
Slate Hill, 10973
Slaterville Springs, 14881
Sloatsburg, 10974
Smithtown, 11787
Smithville Flats, 13841
Smyrna, 48887
Sodus, 49126
Sodus Point, 14555
Somers, 59932
Sound Beach, 11789
South Butler, 13154
South Jamesport, 11968
South New Berlin, 13843
South Otselic, 13155
South Ozone Park, 11420
South Plymouth, 13844
South Richmond Hill, 11419
South Salem, 10590
Southampton, 18966
Southold, 11971
Sparkill, 10976
Spencer, 83446
Speonk, 11972
Spring Valley, 91979
Stanley, 87056
Staten Island, 10314
Sterling, 99672
Stittville, 13469
Stony Brook, 11790
Stony Point, 10980
Suffern, 10901
Sunnyside, 98944
Sylvan Beach, 13157
Syosset, 11791
Syracuse, 84075
Taberg, 13471
Tappan, 10983
Tarrytown, 30470
Thiells, 10984
Thornwood, 10594
Tomkins Cove, 10986
Trout Creek, 13847
Trumansburg, 14886
Truxton, 63381
Tuckahoe, 10707
Tully, 13159
Tuxedo Park, 10987
Unadilla, 68454
Union Springs, 13160
Uniondale, 46791
Unionville, 63565
Upton, 82730
Utica, 68456
Valhalla, 10595
Valley Cottage, 10989
Valley Stream, 11580
Van Etten, 13889
Vernon, 85940
Vernon Center, 13477
Verona, 65769
Verona Beach, 13162
Verplanck, 10596
Vestal, 13851
Victor, 95253
Waccabuc, 10597
Wading River, 11792
Wainscott, 11975
Walden, 80480
Wampsville, 13163
Wantagh, 11793
Warners, 13164
Warwick, 58381
Washingtonville, 44490
Water Mill, 11976
Waterloo, 68069
Waterville, 98858
Weedsport, 13166
Wells Bridge, 13859
West Babylon, 11704
West Bloomfield, 14585
West Burlington, 13479
West Eaton, 13480
West Edmeston, 13485
West Harrison, 10604
West Hempstead, 11552
West Islip, 11795
West Leyden, 13489
West Monroe, 13167
West Nyack, 10994
West Oneonta, 13861
West Sayville, 11796
Westbury, 11590
Westdale, 13483
Westernville, 13486
Westhampton, 11977
Westhampton Beach, 11978
Westmoreland, 66549
Westtown, 19395
White Plains, 10601
Whitesboro, 76273
Whitestone, 11357
Whitney Point, 13862
Willard, 87063
Willet, 13863
Williamstown, 63473
Williston Park, 11596
Willseyville, 13864
Windsor, 95492
Wolcott, 81655
Woodbury, 42288
Woodhaven, 11421
Woodmere, 11598
Woodside, 19980
Wyandanch, 11798
Yaphank, 11980
Yonkers, 10710
Yorktown Heights, 10598
Yorkville, 95494
Aberdeen, 98520
Aberdeen Proving Ground, 21005
Abingdon, 61410
Accokeek, 20607
Adamstown, 21710
Annapolis, 95412
Arnold, 95223
Baltimore, 43105
Bel Air, 21015
Beltsville, 20705
Bethesda, 43719
Bladensburg, 43005
Boonsboro, 21713
Bowie, 85605
Braddock Heights, 21714
Brandywine, 26802
Brentwood, 94513
Brunswick, 68720
Bryans Road, 20616
Burtonsville, 20866
Cabin John, 20818
California, 65018
Cambridge, 83610
Capitol Heights, 20799
Catonsville, 21228
Centreville, 49032
Charlestown, 47111
Charlotte Hall, 20622
Chesapeake Beach, 20732
Chester, 96020
Chestertown, 21690
Chevy Chase, 20825
Clarksburg, 95612
Clinton, 98236
Cockeysville, 21030
College Park, 20742
Columbia, 95310
Crofton, 68730
Damascus, 97089
Deale, 20751
Denton, 76210
Derwood, 20855
District Heights, 20753
Dundalk, 21222
Dunkirk, 47336
Easton, 98925
Edgewater, 32141
Edgewood, 87015
Elkridge, 21075
Elkton, 97436
Ellicott City, 21043
Emmitsburg, 21727
Essex, 92332
Fallston, 28042
Federalsburg, 21632
Fort Washington, 20749
Frederick, 80530
Fulton, 95439
Gaithersburg, 20899
Gambrills, 21054
Germantown, 62245
Glen Burnie, 21062
Glenn Dale, 20769
Grasonville, 21638
Greenbelt, 20771
Greensboro, 47344
Hagerstown, 47346
Hampstead, 28443
Hancock, 56244
Hughesville, 65334
Huntingtown, 20639
Hurlock, 21643
Hyattsville, 20788
Indian Head, 20640
Jarrettsville, 21084
Jefferson, 97352
Jessup, 20794
Kensington, 66951
Kingsville, 78364
La Plata, 87418
Lanham, 20706
Laurel, 68745
Leonardtown, 20650
Lexington Park, 20653
Lusby, 20657
Manchester, 98353
Maugansville, 21767
Mechanicsville, 52306
Middle River, 56737
Middletown, 95461
Monrovia, 91017
Montgomery Village, 20886
Mount Airy, 70076
Mount Rainier, 20712
Myersville, 21773
New Market, 51646
North Beach, 20714
North East, 21901
Ocean City, 21843
Odenton, 21113
Olney, 76374
Owings, 20736
Owings Mills, 21117
Oxon Hill, 20750
Parkville, 21234
Pasadena, 91199
Perry Hall, 21128
Perryman, 21130
Perryville, 99648
Pikesville, 21282
Pocomoke City, 21851
Poolesville, 20837
Potomac, 61865
Prince Frederick, 20678
Randallstown, 21133
Reisterstown, 21136
Ridgely, 38080
Rising Sun, 47040
Riva, 21140
Rockville, 84763
Rosedale, 70772
Salisbury, 65281
Savage, 59262
Severn, 27877
Severna Park, 21146
Shady Side, 20764
Silver Spring, 20997
Smithsburg, 21783
Solomons, 20688
Spencerville, 74760
Stevensville, 59870
Suitland, 20752
Sykesville, 21784
Takoma Park, 20913
Taneytown, 21787
Temple Hills, 20757
Thurmont, 21788
Towson, 21286
Waldorf, 56091
Walkersville, 26447
Westminster, 92685
White Marsh, 23183
Williamsport, 47993
`.trim();

// Normalize city name for matching (lowercase, collapse spaces, remove punctuation)
function normalizeCity(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[.'()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+$/g, '')
    .replace(/^\s+/g, '')
    .trim();
}

// Parse the city-zip list into a map
function parseCityZipList() {
  const map = {};
  const lines = CITY_ZIP_LIST.split('\n');
  for (const line of lines) {
    const match = line.match(/^(.+?),\s*(\d{5}(?:-\d{4})?)\s*$/);
    if (match) {
      const city = match[1].trim();
      const zip = match[2];
      const key = normalizeCity(city);
      map[key] = zip;
    }
  }
  return map;
}

// Build JSON array for cities-zipcodes.json
function buildCitiesZipcodesJson() {
  const arr = [];
  const seen = new Set();
  const lines = CITY_ZIP_LIST.split('\n');
  for (const line of lines) {
    const match = line.match(/^(.+?),\s*(\d{5}(?:-\d{4})?)\s*$/);
    if (match) {
      const city = match[1].trim();
      const zip = match[2];
      const key = normalizeCity(city);
      if (!seen.has(key)) {
        seen.add(key);
        arr.push({ city: city, zipCode: zip });
      }
    }
  }
  return arr;
}

// Build city->zip map from cities-zipcodes.json or parsed list
function getCityZipMap() {
  const CITIES_ZIP_PATH = path.join(__dirname, '..', 'src', 'data', 'cities-zipcodes.json');
  if (fs.existsSync(CITIES_ZIP_PATH)) {
    const arr = JSON.parse(fs.readFileSync(CITIES_ZIP_PATH, 'utf8'));
    const map = {};
    for (const { city, zipCode } of arr) {
      if (city && zipCode) map[normalizeCity(city)] = zipCode;
    }
    return map;
  }
  return parseCityZipList();
}

// Main
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const LOCATIONS_PATH = path.join(DATA_DIR, 'locations.json');
const CITIES_ZIP_PATH = path.join(DATA_DIR, 'cities-zipcodes.json');

// 1. Create cities-zipcodes.json if it doesn't exist
if (!fs.existsSync(CITIES_ZIP_PATH)) {
  const citiesZipArr = buildCitiesZipcodesJson();
  fs.writeFileSync(CITIES_ZIP_PATH, JSON.stringify(citiesZipArr, null, 2), 'utf8');
  console.log(`Created ${CITIES_ZIP_PATH} with ${citiesZipArr.length} entries`);
}

// 2. Update locations.json using cities-zipcodes.json
const cityZipMap = getCityZipMap();
const locationsData = JSON.parse(fs.readFileSync(LOCATIONS_PATH, 'utf8'));
let updated = 0;
let notFound = [];

for (const loc of locationsData.locations) {
  const name = loc.name || '';
  const key = normalizeCity(name);
  const zip = cityZipMap[key];
  if (zip) {
    loc.zipCode = zip;
    // Ensure primary zip is in zipCodes array if it exists
    if (loc.zipCodes && Array.isArray(loc.zipCodes) && !loc.zipCodes.includes(zip)) {
      loc.zipCodes = [zip, ...loc.zipCodes.filter(z => z !== zip)];
    } else if (!loc.zipCodes || !Array.isArray(loc.zipCodes)) {
      loc.zipCodes = [zip];
    }
    updated++;
  } else {
    notFound.push(loc.fullName || `${loc.name}, ${loc.state}`);
  }
}

fs.writeFileSync(LOCATIONS_PATH, JSON.stringify(locationsData, null, 2), 'utf8');
console.log(`Updated ${updated} locations with zipcodes`);
console.log(`${notFound.length} locations had no matching zipcode`);

if (notFound.length > 0 && notFound.length <= 50) {
  console.log('Not found:', notFound.slice(0, 20).join(', '), notFound.length > 20 ? '...' : '');
}
