/*
colorbackbody=255,255,255
colorbackvmenu1=250,250,250
colorbackhmenu1=55,61,90
colorbacktitle1=233,234,237
colorbacklineimpair1=255,255,255
colorbacklineimpair2=255,255,255
colorbacklinepair1=250,250,250
colorbacklinepair2=250,250,250
colorbacklinepairhover=230,237,244
colorbacklinepairchecked=230,237,244
$colortexttitlenotab=0,113,121
$colortexttitle=0,0,0
$colortext=0,0,0
$colortextlink=10, 20, 100
$colortextbackhmenu=FFFFFF
$colortextbackvmenu=000000
dol_hide_topmenu=
dol_hide_leftmenu=
dol_optimize_smallscreen=
dol_no_mouse_hover=
dol_screenwidth=1280
dol_screenheight=921
fontsize=0.86em
nbtopmenuentries=13
fontsizesmaller=0.75em
topMenuFontSize=1.2em
toolTipBgColor=rgba(255, 255, 255, 0.96)
toolTipFontColor=#333
conf->global->THEME_AGRESSIVENESS_RATIO= (must be between -100 and +100)
*/
/* <style type="text/css" > */

/* ============================================================================== */
/* Default styles                                                                 */
/* ============================================================================== */


body {
	background: rgb(255,255,255);
	color: rgb(0,0,0);
	font-size: 0.86em;
	line-height: 1.4;
	font-family: roboto,arial,tahoma,verdana,helvetica;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0;
    margin-left: 0;
    direction: ltr;
}

.sensiblehtmlcontent * {
	position: static !important;
}

.thumbstat { font-weight: bold !important; }
th a { font-weight: normal !important; }
a.tab { font-weight: 500 !important; }

a:link, a:visited, a:hover, a:active { font-family: roboto,arial,tahoma,verdana,helvetica; font-weight: normal; color: rgb(10, 20, 100); text-decoration: none;  }
a:hover { text-decoration: underline; color: rgb(10, 20, 100); }
a.commonlink { color: rgb(10, 20, 100) !important; text-decoration: none; }
th.liste_titre a div div:hover, th.liste_titre_sel a div div:hover { text-decoration: underline; }
input, input.flat, textarea, textarea.flat, form.flat select, select, select.flat, .dataTables_length label select {
	background-color: #FFF;
}
select.vmenusearchselectcombo {
	background-color: unset;
}

input.select2-input {
	border-bottom: none ! important;
}
.select2-choice {
	border: none;
	border-bottom:  solid 1px rgba(0,0,0,.2) !important;	/* required to avoid to lose bottom line when focus is lost on select2. */
}

.liste_titre input[name=month_date_when], .liste_titre input[name=monthvalid], .liste_titre input[name=search_ordermonth], .liste_titre input[name=search_deliverymonth],
.liste_titre input[name=search_smonth], .liste_titre input[name=search_month], .liste_titre input[name=search_emonth], .liste_titre input[name=smonth], .liste_titre input[name=month], .liste_titre select[name=month],
.liste_titre input[name=month_lim], .liste_titre input[name=month_start], .liste_titre input[name=month_end], .liste_titre input[name=month_create],
.liste_titre input[name=search_month_lim], .liste_titre input[name=search_month_start], .liste_titre input[name=search_month_end], .liste_titre input[name=search_month_create],
.liste_titre input[name=search_month_create], .liste_titre input[name=search_month_start], .liste_titre input[name=search_month_end],
.liste_titre input[name=day_date_when], .liste_titre input[name=dayvalid], .liste_titre input[name=search_orderday], .liste_titre input[name=search_deliveryday],
.liste_titre input[name=search_sday], .liste_titre input[name=search_day], .liste_titre input[name=search_eday], .liste_titre input[name=sday], .liste_titre input[name=day], .liste_titre select[name=day],
.liste_titre input[name=day_lim], .liste_titre input[name=day_start], .liste_titre input[name=day_end], .liste_titre input[name=day_create],
.liste_titre input[name=search_day_lim], .liste_titre input[name=search_day_start], .liste_titre input[name=search_day_end], .liste_titre input[name=search_day_create],
.liste_titre input[name=search_day_create], .liste_titre input[name=search_day_start], .liste_titre input[name=search_day_end],
.liste_titre input[name=search_day_date_when], .liste_titre input[name=search_month_date_when], .liste_titre input[name=search_year_date_when],
.liste_titre input[name=search_dtstartday], .liste_titre input[name=search_dtendday], .liste_titre input[name=search_dtstartmonth], .liste_titre input[name=search_dtendmonth],
select#date_startday, select#date_startmonth, select#date_endday, select#date_endmonth, select#reday, select#remonth,
input[name=duration_value]
{
	margin-right: 4px;
}
input[type=submit] {
	margin-left: 5px;
}
input, input.flat, form.flat select, select, select.flat, .dataTables_length label select {
	border: none;
}
input, input.flat, textarea, textarea.flat, form.flat select, select, select.flat, .dataTables_length label select {
    font-family: roboto,arial,tahoma,verdana,helvetica;
    outline: none;
    margin: 0px 0px 0px 0px;
    border-bottom: solid 1px rgba(0,0,0,.2);
}

input {
    line-height: 1.3em;
	padding: 5px;
	padding-left: 5px;
}
select {
	padding-top: 4px;
	padding-right: 4px;
	padding-bottom: 3px;
	padding-left: 2px;
}
input, select {
	margin-left:0px;
	margin-bottom:1px;
	margin-top:1px;
}
input.button.massactionconfirmed {
    margin: 4px;
}

input:invalid, select:invalid {
    border-color: #ea1212;
}

/* Focus definitions must be after standard definition */
textarea:focus {
    /* v6 box-shadow: 0 0 4px #8091BF; */
	border: 1px solid #aaa !important;
}
input:focus, select:focus {
	border-bottom: 1px solid #666;
}
textarea.cke_source:focus
{
	box-shadow: none;
}

textarea {
	border-radius: 0;
	border-top:solid 1px rgba(0,0,0,.2);
	border-left:solid 1px rgba(0,0,0,.2);
	border-right:solid 1px rgba(0,0,0,.2);
	border-bottom:solid 1px rgba(0,0,0,.2);

	padding:4px;
	margin-left:0px;
	margin-bottom:1px;
	margin-top:1px;
	}
input.removedassigned  {
	padding: 2px !important;
	vertical-align: text-bottom;
	margin-bottom: -3px;
}
input.smallpadd {	/* Used for timesheet input */
	padding-left: 0px !important;
	padding-right: 0px !important;
}
input.buttongen {
	vertical-align: middle;
}
input.buttonpayment, button.buttonpayment, div.buttonpayment {
	min-width: 290px;
	margin-bottom: 15px;
	background-image: none;
	line-height: 24px;
	padding: 8px;
	background: none;
	text-align: center;
	border: 0;
	background-color: #9999bb;
	white-space: normal;
	box-shadow: 1px 1px 4px #bbb;
	color: #fff;
	border-radius: 4px;
}
div.buttonpayment input:focus {
    color: #008;
}
.buttonpaymentsmall {
	font-size: 0.65em;
	padding-left: 5px;
	padding-right: 5px;
}
div.buttonpayment input {
    background-color: unset;
    color: #fff;
    border-bottom: unset;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
}
input.buttonpaymentcb {
	background-image: url(/theme/common/credit_card.png);
	background-size: 26px;
	background-repeat: no-repeat;
	background-position: 5px 11px;
}
input.buttonpaymentcheque {
	background-image: url(/theme/common/cheque.png);
	background-size: 24px;
	background-repeat: no-repeat;
	background-position: 5px 8px;
}
input.buttonpaymentpaypal {
	background-image: url(/paypal/img/object_paypal.png);
	background-repeat: no-repeat;
	background-position: 8px 11px;
}
input.buttonpaymentpaybox {
	background-image: url(/paybox/img/object_paybox.png);
	background-repeat: no-repeat;
	background-position: 8px 11px;
}
input.buttonpaymentstripe {
	background-image: url(/stripe/img/object_stripe.png);
	background-repeat: no-repeat;
	background-position: 8px 11px;
}
a.buttonticket {
	padding-left: 5px;
	padding-right: 5px;
}

/* Used by timesheets */
span.timesheetalreadyrecorded input {
    border: none;
    border-bottom: solid 1px rgba(0,0,0,0.4);
    margin-right: 1px !important;
}
td.weekend {
	background-color: #eee;
}
td.onholidaymorning, td.onholidayafternoon {
	background-color: #fdf6f2;
}
td.onholidayallday {
	background-color: #f4eede;
}
td.leftborder, td.hide0 {
	border-left: 1px solid #ccc;
}
td.leftborder, td.hide6 {
	border-right: 1px solid #ccc;
}
td.rightborder {
	border-right: 1px solid #ccc;
}

td.actionbuttons a {
    padding-left: 6px;
}
select.flat, form.flat select {
	font-weight: normal;
	font-size: unset;
}
.optionblue {
	color: rgb(10, 20, 100);
}
.select2-results .select2-highlighted.optionblue {
	color: #FFF !important;
}
.optiongrey, .opacitymedium {
	opacity: 0.4;
}
.opacitymediumbycolor {
	color: rgba(0, 0, 0, 0.4);
}
.opacitylow {
	opacity: 0.6;
}
.opacityhigh {
	opacity: 0.2;
}
.opacitytransp {
	opacity: 0;
}
select:invalid {
	color: gray;
}
input:disabled, textarea:disabled, select[disabled='disabled']
{
	background:#eee;
}

input.liste_titre {
	box-shadow: none !important;
}
input.removedfile {
	padding: 0px !important;
	border: 0px !important;
	vertical-align: text-bottom;
}
input[type=file ]    { background-color: transparent; border-top: none; border-left: none; border-right: none; box-shadow: none; }
input[type=checkbox] { background-color: transparent; border: none; box-shadow: none; }
input[type=radio]    { background-color: transparent; border: none; box-shadow: none; }
input[type=image]    { background-color: transparent; border: none; box-shadow: none; }
input:-webkit-autofill {
	background-color: #FDFFF0 !important;
	background-image:none !important;
	-webkit-box-shadow: 0 0 0 50px #FDFFF0 inset;
}
::-webkit-input-placeholder { color:#ccc; }
input:-moz-placeholder { color:#ccc; }
input[name=price], input[name=weight], input[name=volume], input[name=surface], input[name=sizeheight], input[name=net_measure], select[name=incoterm_id] { margin-right: 6px; }
fieldset { border: 1px solid #AAAAAA !important; }
.legendforfieldsetstep { padding-bottom: 10px; }
input#onlinepaymenturl, input#directdownloadlink {
	opacity: 0.7;
}

div#moretabsList, div#moretabsListaction {
    z-index: 5;
}

hr { border: 0; border-top: 1px solid #ccc; }
.tabBar hr { margin-top: 20px; margin-bottom: 17px; }

.button, .buttonDelete, input[name="sbmtConnexion"] {
	margin-bottom: 0;
	margin-top: 0;
	margin-left: 5px;
	margin-right: 5px;
	font-family: roboto,arial,tahoma,verdana,helvetica;
	display: inline-block;
	padding: 4px 14px;
	text-align: center;
	cursor: pointer;
	text-decoration: none !important;
	background-color: #f5f5f5;
	background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);
	background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));
	background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);
	background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);
	background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);
	background-repeat: repeat-x;
	border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
	border: 1px solid #aaa;
	-webkit-border-radius: 2px;
	border-radius: 1px;

	font-weight: bold;
	text-transform: uppercase;
	color: #444;
}
.button:focus, .buttonDelete:focus  {
	-webkit-box-shadow: 0px 0px 5px 1px rgba(0, 0, 60, 0.2), 0px 0px 0px rgba(60,60,60,0.1);
	box-shadow: 0px 0px 5px 1px rgba(0, 0, 60, 0.2), 0px 0px 0px rgba(60,60,60,0.1);
}
.button:hover, .buttonDelete:hover   {
	/* warning: having a larger shadow has side effect when button is completely on left of a table */
	-webkit-box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 0px 0px rgba(60,60,60,0.1);
	box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 0px 0px rgba(60,60,60,0.1);
}
.button:disabled, .buttonDelete:disabled, .button.disabled {
	opacity: 0.4;
    box-shadow: none;
    -webkit-box-shadow: none;
    cursor: auto;
}
.buttonRefused {
	pointer-events: none;
   	cursor: default;
	opacity: 0.4;
    box-shadow: none;
    -webkit-box-shadow: none;
}
.button_search, .button_removefilter {
    border: unset;
    background-color: unset;
}
.button_search:hover, .button_removefilter:hover {
    cursor: pointer;
}
form {
    padding:0px;
    margin:0px;
}
form#addproduct {
    padding-top: 10px;
}
div.float
{
    float:left;
}
div.floatright
{
    float:right;
}
.inline-block
{
	display:inline-block;
}

th .button {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
	-webkit-border-radius:0px !important;
	border-radius:0px !important;
}
.maxwidthsearch {		/* Max width of column with the search picto */
	width: 54px;
	min-width: 54px;
}
.valigntop {
	vertical-align: top;
}
.valignmiddle {
	vertical-align: middle;
}
.valignbottom {
	vertical-align: bottom;
}
.valigntextbottom {
	vertical-align: text-bottom;
}
.centpercent {
	width: 100%;
}
.quatrevingtpercent, .inputsearch {
	width: 80%;
}
.soixantepercent {
	width: 60%;
}
.quatrevingtquinzepercent {
	width: 95%;
}
textarea.centpercent {
	width: 96%;
}
.small, small {
    font-size: 85%;
}

.h1 .small, .h1 small, .h2 .small, .h2 small, .h3 .small, .h3 small, h1 .small, h1 small, h2 .small, h2 small, h3 .small, h3 small {
    font-size: 65%;
}
.h1 .small, .h1 small, .h2 .small, .h2 small, .h3 .small, .h3 small, .h4 .small, .h4 small, .h5 .small, .h5 small, .h6 .small, .h6 small, h1 .small, h1 small, h2 .small, h2 small, h3 .small, h3 small, h4 .small, h4 small, h5 .small, h5 small, h6 .small, h6 small {
    font-weight: 400;
    line-height: 1;
    color: #777;
}

.center {
    text-align: center;
    margin: 0px auto;
}
.left {
	text-align: left;
}
.right {
	text-align: right;
}
.justify {
	text-align: justify;
}
.pull-left {
    float: left!important;
}
.pull-right {
    float: right!important;
}
.nowrap {
	white-space: nowrap;
}
.liste_titre .nowrap {
	white-space: nowrap;
}
.nowraponall {	/* no wrap on all devices */
	white-space: nowrap;
}
.wrapimp {
	white-space: normal !important;
}
.wordwrap {
	word-wrap: break-word;
}
.wordbreakimp {
	word-break: break-word;
}
.wordbreak {
	word-break: break-all;
}
.bold {
	font-weight: bold !important;
}
.nobold {
	font-weight: normal !important;
}
.nounderline {
    text-decoration: none;
}
.paddingleft {
	padding-left: 4px;
}
.paddingleft2 {
	padding-left: 2px;
}
.paddingright {
	padding-right: 4px;
}
.paddingright2 {
	padding-right: 2px;
}
.marginleft2 {
	margin-left: 2px;
}
.marginright2 {
	margin-right: 2px;
}
.cursordefault {
	cursor: default;
}
.cursorpointer {
	cursor: pointer;
}
.cursormove {
	cursor: move;
}
.cursornotallowed {
	cursor: not-allowed;
}
.backgroundblank {
    background-color: #fff;
}
.nobackground, .nobackground tr {
	background: unset !important;
}
.checkboxattachfilelabel {
    font-size: 0.85em;
    opacity: 0.7;
}

.text-warning{
    color : #a37c0d}
body[class*="colorblind-"] .text-warning{
    color : #a37c0d}
.text-success{
    color : #28a745}
body[class*="colorblind-"] .text-success{
    color : #37de5d}

.text-danger{
    color : #9f4705}

.editfielda span.fa-pencil-alt, .editfielda span.fa-trash {
    color: #ccc !important;
}
.editfielda span.fa-pencil-alt:hover, .editfielda span.fa-trash:hover {
    color: rgb(0,0,0) !important;
}

.fa-toggle-on, .fa-toggle-off { font-size: 2em; }
.websiteselectionsection .fa-toggle-on, .websiteselectionsection .fa-toggle-off,
.asetresetmodule .fa-toggle-on, .asetresetmodule .fa-toggle-off {
	font-size: 1.5em; vertical-align: text-bottom;
}

/* Themes for badges */
/* <style type="text/css" > */
/*
 Badge style is based on boostrap framework
 */

.badge {
    display: inline-block;
    padding: .1em .35em;
    font-size: 80%;
    font-weight: 700 !important;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(255,255,255,0);
    box-sizing: border-box;
}

.badge-status {
    font-size: 1em;
    padding: .19em .35em;			/* more than 0.19 generate a change into heigth of lines */
}

.badge-pill, .tabs .badge {
    padding-right: .5em;
    padding-left: .5em;
    border-radius: 0.25rem;
}

.badge-dot {
    padding: 0;
    border-radius: 50%;
    padding: 0.45em;
    vertical-align: text-top;
}

a.badge:focus, a.badge:hover {
    text-decoration: none;
}

.liste_titre .badge:not(.nochangebackground) {
    background-color: #cccccc;
    color: #fff;
}


/* PRIMARY */
.badge-primary{
    color: #fff !important;
    background-color: #007bff;
}
a.badge-primary.focus, a.badge-primary:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.5);
}
a.badge-primary:focus, a.badge-primary:hover {
    color: #fff !important;
    background-color: #0062e6;
}

/* SECONDARY */
.badge-secondary, .tabs .badge {
    color: #fff !important;
    background-color: #cccccc;
}
a.badge-secondary.focus, a.badge-secondary:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(204,204,204,0.5);
}
a.badge-secondary:focus, a.badge-secondary:hover {
    color: #fff !important;
    background-color: #b3b3b3;
}

/* SUCCESS */
.badge-success {
    color: #fff !important;
    background-color: #55a580;
}
a.badge-success.focus, a.badge-success:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(85,165,128,0.5);
}
a.badge-success:focus, a.badge-success:hover {
    color: #fff !important;
    background-color: #3c8c67;
}

/* DANGER */
.badge-danger {
    color: #fff !important;
    background-color: #9f4705;
}
a.badge-danger.focus, a.badge-danger:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(159,71,5,0.5);
}
a.badge-danger:focus, a.badge-danger:hover {
    color: #fff !important;
    background-color: #862e00;
}

/* WARNING */
.badge-warning {
    color: #fff !important;
    background-color: #a37c0d;
}
a.badge-warning.focus, a.badge-warning:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(163,124,13,0.5);
}
a.badge-warning:focus, a.badge-warning:hover {
    color: #212529 !important;
    background-color: #8a6300;
}

/* WARNING colorblind */
body[class^="colorblind-"] .badge-warning {
	  background-color: #e4e411;
  }
body[class^="colorblind-"] a.badge-warning.focus,body[class^="colorblind-"] a.badge-warning:focus {
	box-shadow: 0 0 0 0.2rem rgba(228,228,17,0.5);
}
body[class^="colorblind-"] a.badge-warning:focus, a.badge-warning:hover {
	background-color: #cbcb00;
}

/* INFO */
.badge-info {
    color: #fff !important;
    background-color: #aaaabb;
}
a.badge-info.focus, a.badge-info:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(170,170,187,0.5);
}
a.badge-info:focus, a.badge-info:hover {
    color: #fff !important;
    background-color: #9191a2;
}

/* LIGHT */
.badge-light {
    color: #212529 !important;
    background-color: #f8f9fa;
}
a.badge-light.focus, a.badge-light:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(248,249,250,0.5);
}
a.badge-light:focus, a.badge-light:hover {
    color: #212529 !important;
    background-color: #dfe0e1;
}

/* DARK */
.badge-dark {
    color: #fff !important;
    background-color: #343a40;
}
a.badge-dark.focus, a.badge-dark:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(52,58,64,0.5);
}
a.badge-dark:focus, a.badge-dark:hover {
    color: #fff !important;
    background-color: #1b2127;
}


/*
 * STATUS BADGES
 */

/* STATUS0 */
.badge-status0 {
        color: #999999 !important;
        border-color: #cbd3d3;
        background-color: #fff;
}
.font-status0 {
        color: #fff !important;
}
.badge-status0.focus, .badge-status0:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.5);
}
.badge-status0:focus, .badge-status0:hover {
    color: #999999 !important;
        border-color: #b2baba;
}

/* STATUS1 */
.badge-status1 {
        color: #ffffff !important;
        background-color: #bc9526;
}
.font-status1 {
        color: #bc9526 !important;
}
.badge-status1.focus, .badge-status1:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(188,149,38,0.5);
}
.badge-status1:focus, .badge-status1:hover {
    color: #ffffff !important;
}

/* COLORBLIND STATUS1 */
body[class*="colorblind-"] .badge-status1 {
        color: #000 !important;
        background-color: #e4e411;
}
body[class*="colorblind-"] .font-status1 {
        color: #e4e411 !important;
}
body[class*="colorblind-"] .badge-status1.focus, body[class*="colorblind-"] .badge-status1:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(228,228,17,0.5);
}
body[class*="colorblind-"] .badge-status1:focus, body[class*="colorblind-"] .badge-status1:hover {
    color: #000 !important;
}

/* STATUS2 */
.badge-status2 {
        color: #212529 !important;
        background-color: #e6f0f0;
}
.font-status2 {
        color: #e6f0f0 !important;
}
.badge-status2.focus, .badge-status2:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(230,240,240,0.5);
}
.badge-status2:focus, .badge-status2:hover {
    color: #212529 !important;
}

/* STATUS3 */
.badge-status3 {
        color: #212529 !important;
        border-color: #bca52b;
        background-color: #fff;
}
.font-status3 {
        color: #fff !important;
}
.badge-status3.focus, .badge-status3:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.5);
}
.badge-status3:focus, .badge-status3:hover {
    color: #212529 !important;
        border-color: #a38c12;
}

/* STATUS4 */
.badge-status4 {
        color: #ffffff !important;
        background-color: #55a580;
}
.font-status4 {
        color: #55a580 !important;
}
.badge-status4.focus, .badge-status4:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(85,165,128,0.5);
}
.badge-status4:focus, .badge-status4:hover {
    color: #ffffff !important;
}

/* COLORBLIND STATUS4 */
body[class*="colorblind-"] .badge-status4 {
        color: #000 !important;
        background-color: #37de5d;
}
body[class*="colorblind-"] .font-status4 {
        color: #37de5d !important;
}
body[class*="colorblind-"] .badge-status4.focus, body[class*="colorblind-"] .badge-status4:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(55,222,93,0.5);
}
body[class*="colorblind-"] .badge-status4:focus, body[class*="colorblind-"] .badge-status4:hover {
    color: #000 !important;
}

/* STATUS5 */
.badge-status5 {
        color: #999999 !important;
        border-color: #cad2d2;
        background-color: #fff;
}
.font-status5 {
        color: #fff !important;
}
.badge-status5.focus, .badge-status5:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.5);
}
.badge-status5:focus, .badge-status5:hover {
    color: #999999 !important;
        border-color: #b1b9b9;
}

/* STATUS6 */
.badge-status6 {
        color: #777777 !important;
        background-color: #cad2d2;
}
.font-status6 {
        color: #cad2d2 !important;
}
.badge-status6.focus, .badge-status6:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(202,210,210,0.5);
}
.badge-status6:focus, .badge-status6:hover {
    color: #777777 !important;
}

/* STATUS7 */
.badge-status7 {
        color: #212529 !important;
        border-color: #baa32b;
        background-color: #fff;
}
.font-status7 {
        color: #fff !important;
}
.badge-status7.focus, .badge-status7:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.5);
}
.badge-status7:focus, .badge-status7:hover {
    color: #212529 !important;
        border-color: #a18a12;
}

/* COLORBLIND STATUS7 */
body[class*="colorblind-"] .badge-status7 {
        color: #212529 !important;
        border-color: #37de5d;
        background-color: #fff;
}
body[class*="colorblind-"] .font-status7 {
        color: #fff !important;
}
body[class*="colorblind-"] .badge-status7.focus, body[class*="colorblind-"] .badge-status7:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.5);
}
body[class*="colorblind-"] .badge-status7:focus, body[class*="colorblind-"] .badge-status7:hover {
    color: #212529 !important;
        border-color: #1ec544;
}

/* STATUS8 */
.badge-status8 {
        color: #ffffff !important;
        background-color: #993013;
}
.font-status8 {
        color: #993013 !important;
}
.badge-status8.focus, .badge-status8:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(153,48,19,0.5);
}
.badge-status8:focus, .badge-status8:hover {
    color: #ffffff !important;
}

/* STATUS9 */
.badge-status9 {
        color: #999999 !important;
        background-color: #e7f0f0;
}
.font-status9 {
        color: #e7f0f0 !important;
}
.badge-status9.focus, .badge-status9:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(231,240,240,0.5);
}
.badge-status9:focus, .badge-status9:hover {
    color: #999999 !important;
}

.borderrightlight
{
	border-right: 1px solid #DDD;
}
#formuserfile {
	margin-top: 4px;
}
#formuserfile_link {
	margin-left: 1px;
}
.listofinvoicetype {
	height: 28px;
	vertical-align: middle;
}
.divsocialnetwork:not(:first-child) {
    padding-left: 20px;
}
div.divsearchfield {
	float: left;
	margin-right: 12px;
    margin-left: 2px;
	margin-top: 4px;
    margin-bottom: 4px;
  	padding-left: 2px;
}
.divsearchfieldfilter {
    text-overflow: clip;
    overflow: auto;
    padding-bottom: 5px;
    opacity: 0.6;
}
div.confirmmessage {
	padding-top: 6px;
}
ul.attendees {
	padding-top: 0;
	padding-bottom: 0;
	padding-left: 0;
	margin-top: 0;
	margin-bottom: 0;
}
ul.attendees li {
	list-style-type: none;
	padding-top:1px;
	padding-bottom:1px;
}
.googlerefreshcal {
	padding-top: 4px;
	padding-bottom: 4px;
}
.paddingtopbottom {
	padding-top: 10px;
	padding-bottom: 10px;
}
.checkallactions {
    margin-left: 2px;		/* left must be same than right to keep checkbox centered */
    margin-right: 2px;		/* left must be same than right to keep checkbox centered */
    vertical-align: middle;
}
select.flat.selectlimit {
    max-width: 62px;
}
.selectlimit, .marginrightonly {
	margin-right: 10px !important;
}
.marginleftonly {
	margin-left: 10px !important;
}
.marginleftonlyshort {
	margin-left: 4px !important;
}
.nomarginleft {
	margin-left: 0px !important;
}
.margintoponly {
	margin-top: 10px !important;
}
.marginbottomonly {
	margin-bottom: 10px !important;
}
.selectlimit, .selectlimit:focus {
    border-left: none !important;
    border-top: none !important;
    border-right: none !important;
    outline: none;
}
.strikefordisabled {
	text-decoration: line-through;
}
.widthdate {
	width: 130px;
}
/* using a tdoverflowxxx make the min-width not working */
.tdoverflow {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tdoverflowmax50 {			/* For tdoverflow, the max-midth become a minimum ! */
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tdoverflowmax100 {			/* For tdoverflow, the max-midth become a minimum ! */
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tdoverflowmax150 {			/* For tdoverflow, the max-midth become a minimum ! */
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tdoverflowmax200 {			/* For tdoverflow, the max-midth become a minimum ! */
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tdoverflowmax300 {			/* For tdoverflow, the max-midth become a minimum ! */
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tdoverflowauto {
    max-width: 0;
    overflow: auto;
}
.divintdwithtwolinesmax {
    width: 75px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.twolinesmax {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.tablelistofcalendars {
	margin-top: 25px !important;
}
.amountalreadypaid {
}
.amountpaymentcomplete {
	color: #008800;
	font-weight: bold;
	font-size: 1.2em;
}
.amountremaintopay {
	color: #880000;
	font-weight: bold;
	font-size: 1.2em;
}
.amountremaintopayback {
	font-weight: bold;
	font-size: 1.2em;
}
.amountpaymentneutral {
	font-weight: bold;
	font-size: 1.2em;
}
.savingdocmask {
	margin-top: 6px;
	margin-bottom: 12px;
}
#builddoc_form ~ .showlinkedobjectblock {
    margin-top: 20px;
}

/* For the long description of module */
.moduledesclong p img, .moduledesclong p a img {
    max-width: 90% !important;
    height: auto !important;
}
.imgdoc {
    margin: 18px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 25px #aaa;
    max-width: calc(100% - 56px);
}
.fa-file-text-o, .fa-file-code-o, .fa-file-powerpoint-o, .fa-file-excel-o, .fa-file-word-o, .fa-file-o, .fa-file-image-o, .fa-file-video-o, .fa-file-audio-o, .fa-file-archive-o, .fa-file-pdf-o {
	color: #055;
}

.fa-15 {
	font-size: 1.5em;
}

/* DOL_XXX for future usage (when left menu has been removed). If we do not use datatable */
/*.table-responsive {
    width: calc(100% - 330px);
    margin-bottom: 15px;
    overflow-y: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}*/
/* Style used for most tables */
.div-table-responsive, .div-table-responsive-no-min {
    overflow-x: auto;
    min-height: 0.01%;
}
.div-table-responsive {
    line-height: 120%;
}
/* Style used for full page tables with field selector and no content after table (priority before previous for such tables) */
div.fiche>form>div.div-table-responsive, div.fiche>form>div.div-table-responsive-no-min {
    overflow-x: auto;
}
div.fiche>form>div.div-table-responsive {
    min-height: 392px;
}
div.fiche>div.tabBar>form>div.div-table-responsive {
    min-height: 392px;
}
div.fiche {
	/* text-align: justify; */
}

.flexcontainer {
    display: inline-flex;
    flex-flow: row wrap;
    justify-content: flex-start;
}
.thumbstat {
    min-width: 148px;
}
.thumbstat150 {
    min-width: 168px;
    max-width: 169px;
    /* width: 168px; If I use with, there is trouble on size of flex boxes solved with min+max that is a little bit higer than min */
}
.thumbstat, .thumbstat150 {
	flex-grow: 1;
	flex-shrink: 0;
}

select.selectarrowonleft {
	direction: rtl;
}
select.selectarrowonleft option {
	direction: ltr;
}

table[summary="list_of_modules"] .fa-cog {
    font-size: 1.5em;
}

.linkedcol-element {
	min-width: 100px;
}

.img-skinthumb {
	width: 160px;
	height: 100px;
}


/* ============================================================================== */
/* Styles to hide objects                                                         */
/* ============================================================================== */

.clearboth  { clear:both; }
.hideobject { display: none; }
.minwidth50  { min-width: 50px; }
/* rule for not too small screen only */
@media only screen and (min-width: 741px)
{
	.width25  { width: 25px; }
    .width50  { width: 50px; }
    .width75  { width: 75px; }
    .width100 { width: 100px; }
    .width200 { width: 200px; }
    .minwidth100 { min-width: 100px; }
    .minwidth150 { min-width: 150px; }
    .minwidth200 { min-width: 200px; }
    .minwidth300 { min-width: 300px; }
    .minwidth400 { min-width: 400px; }
    .minwidth500 { min-width: 500px; }
    .minwidth50imp  { min-width: 50px !important; }
    .minwidth75imp  { min-width: 75px !important; }
    .minwidth100imp { min-width: 100px !important; }
    .minwidth200imp { min-width: 200px !important; }
    .minwidth250imp { min-width: 250px !important; }
    .minwidth300imp { min-width: 300px !important; }
    .minwidth400imp { min-width: 400px !important; }
    .minwidth500imp { min-width: 500px !important; }
}
.widthauto { width: auto; }
.width25  { width: 25px; }
.width50  { width: 50px; }
.width75  { width: 75px; }
.width100 { width: 100px; }
.width150 { width: 150px; }
.width200 { width: 200px; }
.maxwidth25  { max-width: 25px; }
.maxwidth50  { max-width: 50px; }
.maxwidth75  { max-width: 75px; }
.maxwidth100 { max-width: 100px; }
.maxwidth125 { max-width: 125px; }
.maxwidth150 { max-width: 150px; }
.maxwidth200 { max-width: 200px; }
.maxwidth300 { max-width: 300px; }
.maxwidth400 { max-width: 400px; }
.maxwidth500 { max-width: 500px; }
.maxwidth50imp  { max-width: 50px !important; }
.maxwidth75imp  { max-width: 75px !important; }
.minheight20 { min-height: 20px; }
.minheight40 { min-height: 40px; }
.titlefieldcreate { width: 20%; }
.titlefield       { /* width: 25%; */ width: 250px; }
.titlefieldmiddle { width: 50%; }
.imgmaxwidth180 { max-width: 180px; }
.imgmaxheight50 { max-height: 50px; }

.width20p { width:20%; }
.width25p { width:25%; }
.width40p { width:40%; }
.width50p { width:50%; }
.width60p { width:60%; }
.width75p { width:75%; }
.width80p { width:80%; }
.width100p { width:100%; }


/* Force values for small screen 1400 */
@media only screen and (max-width: 1400px)
{
	.titlefield { /* width: 30% !important; */ }
	.titlefieldcreate { width: 30% !important; }
	.minwidth50imp  { min-width: 50px !important; }
    .minwidth75imp  { min-width: 75px !important; }
    .minwidth100imp { min-width: 100px !important; }
    .minwidth150imp { min-width: 150px !important; }
    .minwidth200imp { min-width: 200px !important; }
    .minwidth250imp { min-width: 250px !important; }
    .minwidth300imp { min-width: 300px !important; }
    .minwidth400imp { min-width: 300px !important; }
    .minwidth500imp { min-width: 300px !important; }

    .linkedcol-element {
		min-width: unset;
	}
}

/* Force values for small screen 1000 */
@media only screen and (max-width: 1000px)
{
    .maxwidthonsmartphone { max-width: 100px; }
	.minwidth50imp  { min-width: 50px !important; }
    .minwidth75imp  { min-width: 75px !important; }
    .minwidth100imp { min-width: 100px !important; }
    .minwidth150imp { min-width: 110px !important; }
    .minwidth200imp { min-width: 110px !important; }
    .minwidth250imp { min-width: 115px !important; }
    .minwidth300imp { min-width: 120px !important; }
    .minwidth400imp { min-width: 150px !important; }
    .minwidth500imp { min-width: 250px !important; }
}

/* Force values for small screen 767 */
@media only screen and (max-width: 767px)
{
	body {
		font-size: 0.86em;
	}
	div.refidno {
		font-size: 0.86em !important;
	}
}

/* Force values for small screen 570 */
@media only screen and (max-width: 570px)
{
	body {
		font-size: 0.86em;
	}
	div.refidno {
		font-size: 0.86em !important;
	}

	div#login_left, div#login_right {
		min-width: 150px !important;
		max-width: 200px !important;
		padding-left: 5px !important;
		padding-right: 5px !important;
	}

	div.login_block {
		height: 64px !important;
	}

	.divmainbodylarge { margin-left: 20px !important; margin-right: 20px !important; }

    .tdoverflowonsmartphone {
        max-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .border tbody tr, .border tbody tr td, div.tabBar table.border tr, div.tabBar table.border tr td, div.tabBar div.border .table-border-row, div.tabBar div.border .table-key-border-col, div.tabBar div.border .table-val-border-col {
    	height: 40px !important;
    }

    .quatrevingtpercent, .inputsearch {
    	width: 95%;
    }

	select {
		padding-top: 4px;
		padding-bottom: 5px;
	}

	.login_table .tdinputlogin {
		min-width: unset !important;
	}
	input, input[type=text], input[type=password], select, textarea     {
		min-width: 20px;
    }
    .trinputlogin input[type=text], input[type=password] {
		max-width: 140px;
	}
    .vmenu .searchform input {
		max-width: 138px;	/* length of input text in the quick search box when using a smartphone and without dolidroid */
	}

    .hideonsmartphone { display: none; }
    .hideonsmartphoneimp { display: none !important; }
    .noenlargeonsmartphone { width : 50px !important; display: inline !important; }
    .maxwidthonsmartphone, #search_newcompany.ui-autocomplete-input { max-width: 100px; }
    .maxwidth50onsmartphone { max-width: 40px; }
    .maxwidth75onsmartphone { max-width: 50px; }
    .maxwidth100onsmartphone { max-width: 70px; }
    .maxwidth150onsmartphone { max-width: 120px; }
    .maxwidth150onsmartphoneimp { max-width: 120px !important; }
    .maxwidth200onsmartphone { max-width: 200px; }
    .maxwidth300onsmartphone { max-width: 300px; }
    .maxwidth400onsmartphone { max-width: 400px; }
	.minwidth50imp  { min-width: 50px !important; }
	.minwidth75imp  { min-width: 75px !important; }
    .minwidth100imp { min-width: 100px !important; }
    .minwidth150imp { min-width: 110px !important; }
    .minwidth200imp { min-width: 110px !important; }
    .minwidth250imp { min-width: 115px !important; }
    .minwidth300imp { min-width: 120px !important; }
    .minwidth400imp { min-width: 150px !important; }
    .minwidth500imp { min-width: 250px !important; }
    .titlefield { width: auto; }
    .titlefieldcreate { width: auto; }

	#tooltip {
		position: absolute;
		width: 300px;
	}

	/* intput, input[type=text], */
	select {
		width: 98%;
		min-width: 40px;
	}

	div.divphotoref {
		padding-right: 5px;
	    padding-bottom: 5px;
	}
    img.photoref, div.photoref {
    	border: none;
        -webkit-box-shadow: none;
        box-shadow: none;
        padding: 4px;
    	height: 20px;
    	width: 20px;
        object-fit: contain;
    }

	div.statusref {
    	padding-right: 10px;
   	}
	div.statusref img {
    	padding-right: 3px !important;
   	}
	div.statusrefbis {
    	padding-right: 3px !important;
   	}
	/* TODO
	div.statusref {
    	padding-top: 0px !important;
    	padding-left: 0px !important;
    	border: none !important;
   	}
	*/

   	input.buttonpayment {
		min-width: 300px;
   	}
}
.linkobject { cursor: pointer; }

table.tableforfield tr>td:first-of-type, div.tableforfield div.tagtr>div.tagtd:first-of-type {
	color: #666;
}



/* ============================================================================== */
/* Styles for dragging lines                                                      */
/* ============================================================================== */

.dragClass {
	color: #002255;
}
td.showDragHandle {
	cursor: move;
}
.tdlineupdown {
	white-space: nowrap;
	min-width: 10px;
}


/* ============================================================================== */
/* Styles de positionnement des zones                                             */
/* ============================================================================== */

#id-container {
	display: table;					/* DOL_XXX Empeche fonctionnement correct du scroll horizontal sur tableau, avec datatable ou CSS */
	table-layout: fixed;
}
#id-right, #id-left {
	display: table-cell;			/* DOL_XXX Empeche fonctionnement correct du scroll horizontal sur tableau, avec datatable ou CSS */
	float: none;
	vertical-align: top;
}
#id-left {
	padding-top: 20px;
	padding-bottom: 5px;
	}
#id-right {	/* This must stay id-right and not be replaced with echo $right */
	padding-top: 10px;
	width: 100%;
	background: rgb(255,255,255);
	padding-bottom: 20px;
}
#id-left {
/*	background-color: #fff;
	border-right: 1px #888 solid;
	height: calc(100% - 50px);*/
}

.side-nav-vert {
	position: sticky;
	top: 0px;
	z-index: 210;
}

.side-nav {
	display: table-cell;
	border-right: 1px solid #d0d0d0;
	box-shadow: 3px 0 6px -2px #eee;
	background: rgb(250,250,250);
	transition: left 0.5s ease;
}

.side-nav, .login_block {
	transition: left 0.5s ease;
}

div.blockvmenulogo
{
	border-bottom: 0 !important;
}
.menulogocontainer {
    margin: 6px;
    margin-left: 11px;
    margin-right: 9px;
    padding: 0;
    height: 32px;
    /* width: 100px; */
    max-width: 100px;
    vertical-align: middle;
}
.backgroundforcompanylogo {
    background-color: rgba(255,255,255,0.7);
    border-radius: 4px;
}
.menulogocontainer img.mycompany {
    object-fit: contain;
    width: inherit;
    height: inherit;
}
#mainmenutd_companylogo::after, #mainmenutd_menu::after {
	content: unset !important;
}
li#mainmenutd_companylogo .tmenucenter {
	width: unset;
}
li#mainmenutd_companylogo {
	min-width: unset !important;
}

div.blockvmenupair, div.blockvmenuimpair {
	border-top: none !important;
	border-left: none !important;
	border-right: none !important;
	border-bottom: 1px solid #e0e0e0;
	padding-left: 0 !important;
}
div.blockvmenuend, div.blockvmenubookmarks {
	border: none !important;
	padding-left: 0 !important;
}
div.vmenu, td.vmenu {
	padding-right: 10px !important;
}
.blockvmenu .menu_titre {
    margin-top: 4px;
    margin-bottom: 1px;
}

/* Try responsive even not on smartphone
#id-container {
	width: 100%;
}
#id-right {
	width: calc(100% - 200px) !important;
}
*/


.menuhider { display: none !important; }

/* rule to reduce top menu - 3rd reduction: The menu for user is on left */
@media only screen and (max-width: 741px)	/* reduction 3 */
{
body.sidebar-collapse .side-nav {
	display: none;
}

body.sidebar-collapse .login_block {
	display: none;
}

.menuhider { display: block !important; }
.dropdown-user-image { display: none; }
.user-header { height: auto !important; color: rgb(255,255,255); }

#id-container {
	width: 100%;
}
.side-nav {
	border-bottom: 1px solid #BBB;
	background: #FFF;
	padding-left: 20px;
	padding-right: 20px;
	position: absolute;
    	z-index: 90;
}
div.blockvmenulogo
{
	border-bottom: 0 !important;
}
/*div.blockvmenusearch {
	padding-bottom: 12px !important;
	border-bottom: 1px solid #e0e0e0;
}*/
div.blockvmenupair, div.blockvmenuimpair, div.blockvmenubookmarks, div.blockvmenuend {
	border-top: none !important;
	border-left: none !important;
	border-right: none !important;
	border-bottom: 1px solid #e0e0e0;
	padding-left: 0 !important;
}
div.vmenu, td.vmenu {
	padding-right: 6px !important;
}
div.fiche {
	margin-left: 9px !important;
	margin-right: 10px !important;
}
}


div.fiche {
	margin-left: 30px;
	margin-right: 28px;
		}
body.onlinepaymentbody div.fiche {	/* For online payment page */
	margin: 20px !important;
}
div.fiche>table:first-child {
	margin-bottom: 15px !important;
}
div.fichecenter {
	width: 100%;
	clear: both;	/* This is to have div fichecenter that are true rectangles */
}
div.fichecenterbis {
	margin-top: 8px;
}
div.fichethirdleft {
	float: left;
	width: 50%;
	}
div.fichetwothirdright {
	float: right;
	width: 50%;
	}
div.fichetwothirdright div.ficheaddleft {
    padding-left: 20px;
}
div.fichehalfleft {
	float: left;
	width: calc(50% - 10px);
}
div.fichehalfright {
	float: right;
	width: calc(50% - 10px);
}
div.fichehalfright {
	}
div.firstcolumn div.box {
	padding-right: 10px;
}
div.secondcolumn div.box {
	padding-left: 10px;
}
/* Force values on one colum for small screen */
@media only screen and (max-width: 1000px)
{
    div.fiche {
    	margin-left: 20px;
    	margin-right: 6px;
    }
    div.fichecenter {
    	width: 100%;
    	clear: both;	/* This is to have div fichecenter that are true rectangles */
    }
    div.fichecenterbis {
    	margin-top: 8px;
    }
    div.fichethirdleft {
    	float: none;
    	width: auto;
    	padding-bottom: 6px;
    }
    div.fichetwothirdright {
    	float: none;
    	width: auto;
    	padding-bottom: 6px;
    }
    div.fichetwothirdright div.ficheaddleft {
    	padding-left: 0;
	}
    div.fichehalfleft {
    	float: none;
    	width: auto;
    }
    div.fichehalfright {
    	float: none;
    	width: auto;
    }
    div.fichehalfright {
    	margin-top: 10px;
    }
    div.firstcolumn div.box {
		padding-right: 0px;
	}
	div.secondcolumn div.box {
		padding-left: 0px;
	}
}

/* Force values on one colum for small screen */
@media only screen and (max-width: 1599px)
{
    div.fichehalfleft-lg {
    	float: none;
    	width: auto;
    }
    div.fichehalfright-lg {
    	float: none;
    	width: auto;
    }

    .fichehalfright-lg .fichehalfright {
    	padding-left:0;
    }
}

/* For table into table into card */
div.fichehalfright tr.liste_titre:first-child td table.nobordernopadding td {
    padding: 0 0 0 0;
}
div.nopadding {
	padding: 0 !important;
}

.containercenter {
	display : table;
	margin : 0px auto;
}

.pictotitle {
	margin-right: 8px;
	margin-bottom: 4px;
}
.pictoobjectwidth {
	width: 14px;
}
.pictosubstatus {
    padding-left: 2px;
    padding-right: 2px;
}
.pictostatus {
	width: 15px;
	vertical-align: middle;
	margin-top: -3px
}
.pictowarning, .pictopreview {
    padding-left: 3px;
}
.pictowarning {
    /* vertical-align: text-bottom; */
    color: #a37c0d;
}
.pictoerror {
    color: #9f4705;
}
.pictomodule {
	width: 14px;
}
.pictomodule {
	width: 14px;
}
.fiche .arearef img.pictoedit, .fiche .arearef span.pictoedit,
.fiche .fichecenter img.pictoedit, .fiche .fichecenter span.pictoedit,
.tagtdnote span.pictoedit {
    opacity: 0.4;
}
.colorthumb {
	padding-left: 1px !important;
	padding-right: 1px;
	padding-top: 1px;
	padding-bottom: 1px;
	width: 44px;
	text-align:center;
}
div.attacharea {
	padding-top: 18px;
	padding-bottom: 10px;
}
div.attachareaformuserfileecm {
	padding-top: 0;
	padding-bottom: 0;
}

div.arearef {
	padding-top: 2px;
	margin-bottom: 10px;
	padding-bottom: 10px;
}
div.arearefnobottom {
	padding-top: 2px;
	padding-bottom: 4px;
}
div.heightref {
	min-height: 80px;
}
div.divphotoref {
	padding-right: 20px;
}
div.paginationref {
	padding-bottom: 10px;
}
/* TODO
div.statusref {
   	padding: 10px;
   	border: 1px solid #bbb;
   	border-radius: 6px;
} */
div.statusref {
	float: right;
	padding-left: 12px;
	margin-top: 8px;
	margin-bottom: 10px;
	clear: both;
}
div.statusref img {
    padding-left: 8px;
   	padding-right: 9px;
   	vertical-align: text-bottom;
   	width: 18px;
}
div.statusrefbis {
    padding-left: 8px;
   	padding-right: 9px;
   	vertical-align: text-bottom;
}
img.photoref, div.photoref {
	border: 1px solid #DDD;
    -webkit-box-shadow: 0px 0px 6px #DDD;
    box-shadow: 0px 0px 6px #DDD;
    padding: 4px;
	height: 80px;
	width: 80px;
    object-fit: contain;
}
img.fitcontain {
    object-fit: contain;
}
div.photoref {
	display:table-cell;
	vertical-align:middle;
	text-align:center;
}
img.photorefnoborder {
    padding: 2px;
	height: 48px;
	width: 48px;
    object-fit: contain;
    border: 1px solid #AAA;
    border-radius: 100px;
}
.underrefbanner {
}
.underbanner {
	border-bottom: 1px solid rgb(200,200,200);
	/* border-bottom: 2px solid rgb(55,61,90); */
}
.trextrafieldseparator td {
    /* border-bottom: 2px solid rgb(55,61,90) !important; */
    border-bottom: 2px solid rgb(200,200,200) !important;
}

.tdhrthin {
	margin: 0;
	padding-bottom: 0 !important;
}

/* ============================================================================== */
/* Menu top et 1ere ligne tableau                                                 */
/* ============================================================================== */

div#id-top {
	background: rgb(55,61,90);
	background-image: linear-gradient(-45deg, #3c425f, rgb(55,61,90));
	/* box-shadow: 0px 0px 5px #eee; */
}

div#tmenu_tooltip {
	padding-right: 170px;

  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */


}

div.topmenuimage {
}

div.tmenudiv {
    position: relative;
    display: block;
    white-space: nowrap;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    padding: 0px 0px 0px 0px;	/* t r b l */
    margin: 0px 0px 0px 0px;	/* t r b l */
	font-size: 13px;
    font-weight: normal;
	color: #000000;
    text-decoration: none;
}
div.tmenudisabled, a.tmenudisabled {
	opacity: 0.6;
}
a.tmenu, a.tmenusel, a.tmenudisabled {
    font-weight: 300;
}
a.tmenudisabled:link, a.tmenudisabled:visited, a.tmenudisabled:hover, a.tmenudisabled:active {
	padding: 0px 5px 0px 5px;
	white-space: nowrap;
	color: #FFFFFF;
	text-decoration: none;
	cursor: not-allowed;
}

a.tmenu:link, a.tmenu:visited, a.tmenu:hover, a.tmenu:active {
	padding: 0px 4px 0px 4px;
	white-space: nowrap;
	color: #FFFFFF;
    text-decoration: none;
}
a.tmenusel:link, a.tmenusel:visited, a.tmenusel:hover, a.tmenusel:active {
	padding: 0px 4px 0px 4px;
	margin: 0px 0px 0px 0px;
	white-space: nowrap;
	color: #FFFFFF;
	text-decoration: none !important;
}


ul.tmenu {	/* t r b l */
    padding: 0px 0px 0px 0px;
    margin: 0px 0px 0px 0px;
	list-style: none;
	display: table;
}
ul.tmenu li {	/* We need this to have background color when menu entry wraps on new lines */
}
li.tmenu, li.tmenusel {
	min-width: 66px;	text-align: center;
	vertical-align: bottom;
		float: left;
    	position:relative;
	display: block;
	padding: 0 0 0 0;
	margin: 0 0 0 0;
	font-weight: normal;
}
li.menuhider:hover {
	background-image: none !important;
}

li.tmenusel::after, li.tmenu:hover::after{
	content: "";
	position:absolute;
	bottom:0px;
	left: 50%;
	left: calc(50% - 6px);
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 0px 6px 5px 6px;
	border-color:  transparent transparent #ffffff transparent;
}

.tmenuend .tmenuleft { width: 0px; }
.tmenuend { display: none; }
div.tmenuleft
{
	float: left;
	margin-top: 0px;
		width: 5px;
			height: 48px;
	}
div.tmenucenter
{
	padding-left: 0px;
	padding-right: 3px;
		padding-top: 2px;
    height: 48px;
	    /* width: 100%; */
}
#menu_titre_logo {
	padding-top: 0;
	padding-bottom: 0;
}
div.menu_titre {
	padding-top: 4px;
	padding-bottom: 4px;
	overflow: hidden;
    text-overflow: ellipsis;
    width: 188px;				/* required to have overflow working. must be same than menu_contenu */
}
.mainmenuaspan
{
	padding-left: 2px;
	padding-right: 2px;
}

div.mainmenu {
	position : relative;
	background-repeat:no-repeat;
	background-position:center top;
	height: 26px;
	margin-left: 0px;
	min-width: 40px;
}

/* For mainmenu, we always load the img */

div.mainmenu.menu {
	background-image: url(/theme/eldy/img/menus/menu.png);
	top: 7px}
#mainmenutd_menu a.tmenuimage {
    display: unset;
}
a.tmenuimage {
    display: block;
}

a.tmenuimage:hover{
	text-decoration: none;
}




/* Do not load menu img for other if hidden to save bandwidth */

            /* <style type="text/css" > */

.mainmenu::before{
    /* font part */
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 26px;
	font-size: 1.2em;
    -webkit-font-smoothing: antialiased;
    text-align:center;
	text-decoration:none;
	color: #FFFFFF;
}


div.mainmenu.menu {
	background-image: none;
}

div.mainmenu.menu::before {
	content: "\f0c9";
}


div.mainmenu.home::before{
	content: "\f015";
}

div.mainmenu.billing::before {
    content: "\f51e";
}

div.mainmenu.accountancy::before {
    content: "\f53d";
}

div.mainmenu.agenda::before {
    content: "\f073";
}

div.mainmenu.bank::before {
    content: "\f19c";
}

div.mainmenu.cashdesk::before {
    content: "\f788";
}



div.mainmenu.takepos::before {
    content: "\f788";
}

div.mainmenu.companies::before {
    content: "\f1ad";
}

div.mainmenu.commercial::before {
    content: "\f0f2";
}

div.mainmenu.ecm::before {
    content: "\f07c";
}

div.mainmenu.externalsite::before {
    content: "\f360";
}

div.mainmenu.ftp::before {
    content: "\f362";
}

div.mainmenu.hrm::before {
    content: "\f508";
}

div.mainmenu.members::before {
    content: "\f0c0";
}

div.mainmenu.products::before {
    content: "\f1b2";
}

div.mainmenu.mrp::before {
    content: "\f1b3";
}

div.mainmenu.project::before {
    content: "\f0e8";
}

div.mainmenu.ticket::before {
    content: "\f3ff";
}

div.mainmenu.tools::before {
    content: "\f0ad";
}

div.mainmenu.website::before {
    content: "\f542";
}

div.mainmenu.generic1::before {
    content: "\f249";
}

div.mainmenu.generic2::before {
    content: "\f249";
}

div.mainmenu.generic3::before {
    content: "\f249";
}

div.mainmenu.generic4::before {
    content: "\f249";
}
    
    /* A mainmenu entry was found but img file api.png not found (check /api/img/api.png), so we use a generic one */
div.mainmenu.api::before {
                    content: "\f249";
                }/* A mainmenu entry was found but img file multicompany.png not found (check /multicompany/img/multicompany.png), so we use a generic one */
div.mainmenu.multicompany::before {
                    content: "\f249";
                }/* A mainmenu entry was found but img file milestone.png not found (check /milestone/img/milestone.png), so we use a generic one */
div.mainmenu.milestone::before {
                    content: "\f249";
                }/* A mainmenu entry was found but img file updatelines.png not found (check /updatelines/img/updatelines.png), so we use a generic one */
div.mainmenu.updatelines::before {
                    content: "\f249";
                }
.tmenuimage {
    padding:0 0 0 0 !important;
    margin:0 0px 0 0 !important;
    }



/* Login */

.bodylogin
{
	background: #f0f0f0;
	display: table;
    position: absolute;
    height: 100%;
    width: 100%;
    font-size: 1em;
}
.login_center {
	display: table-cell;
    vertical-align: middle;
}
.login_vertical_align {
	padding: 10px;
	padding-bottom: 80px;
}
form#login {
	padding-bottom: 30px;
	font-size: 14px;
	vertical-align: middle;
}
.login_table_title {
	max-width: 530px;
	color: #eee !important;
	padding-bottom: 20px;
	text-shadow: 1px 1px #444;
}
.login_table label {
	text-shadow: 1px 1px 1px #FFF;
}
.login_table {
	margin: 0px auto;  /* Center */
	padding-left:6px;
	padding-right:6px;
	padding-top:16px;
	padding-bottom:12px;
	max-width: 560px;
	background-color: #FFFFFF;
	-webkit-box-shadow: 0 2px 23px 2px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(60,60,60,0.15);
	box-shadow: 0 2px 23px 2px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(60,60,60,0.15);

	border-radius: 5px;
	/*border-top:solid 1px rgba(180,180,180,.4);
	border-left:solid 1px rgba(180,180,180,.4);
	border-right:solid 1px rgba(180,180,180,.4);
	border-bottom:solid 1px rgba(180,180,180,.4);*/
}
.login_table input#username, .login_table input#password, .login_table input#securitycode {
	border: none;
	border-bottom: solid 1px rgba(180,180,180,.4);
	padding: 5px;
	margin-left: 5px;
	margin-top: 5px;
	margin-bottom: 5px;
}
.login_table input#username:focus, .login_table input#password:focus, .login_table input#securitycode:focus {
	outline: none !important;
}
.login_table .trinputlogin {
	font-size: 1.2em;
	margin: 8px;
}
.login_table .tdinputlogin {
    background-color: transparent;
    /* border: 2px solid #ccc; */
    min-width: 220px;
    border-radius: 2px;
}
.login_table .tdinputlogin .fa {
	padding-left: 10px;
	width: 14px;
}
.login_table .tdinputlogin input#username, .login_table .tdinputlogin input#password {
	font-size: 1em;
}
.login_table .tdinputlogin input#securitycode {
	font-size: 1em;
}
.login_main_home {
    word-break: break-word;
}
.login_main_message {
	text-align: center;
	max-width: 570px;
	margin-bottom: 22px;
}
.login_main_message .error {
	/* border: 1px solid #caa; */
	padding: 10px;
}
div#login_left, div#login_right {
	display: inline-block;
	min-width: 245px;
	padding-top: 10px;
	padding-left: 16px;
	padding-right: 16px;
	text-align: center;
	vertical-align: middle;
}
div#login_right select#entity {
    margin-top: 10px;
}
table.login_table tr td table.none tr td {
	padding: 2px;
}
table.login_table_securitycode {
	border-spacing: 0px;
}
table.login_table_securitycode tr td {
	padding-left: 0px;
	padding-right: 4px;
}
#securitycode {
	min-width: 60px;
}
#img_securitycode {
	border: 1px solid #DDDDDD;
}
#img_logo, .img_logo {
	max-width: 170px;
	max-height: 90px;
}

div.backgroundsemitransparent {
	background:rgba(255,255,255,0.6);
	padding-left: 10px;
	padding-right: 10px;
}
div.login_block {
	position: absolute;
	text-align: right;
	right: 0;
	top: 0;
	line-height: 10px;
		}
div.login_block a {
	color: #FFFFFF;
	display: inline-block;
}
div.login_block table {
	display: inline;
}
div.login {
	white-space:nowrap;
	font-weight: bold;
	float: right;
}
div.login a {
	color: #000000;
}
div.login a:hover {
	color: #000000;
	text-decoration:underline;
}
.login_block_elem a span.atoplogin, .login_block_elem span.atoplogin {
    vertical-align: middle;
}
div.login_block_user {
	display: inline-block;
}
div.login_block_other {
	display: inline-block;
	clear: both;
}
div.login_block_other { padding-top: 0; text-align: right; margin-right: 8px; }

.login_block_elem {
	float: right;
	vertical-align: top;
	padding: 0px 3px 0px 4px !important;
	line-height: 48px;
	height: 50px;
}
.atoplogin, .atoplogin:hover {
	color: #FFFFFF !important;
}
.login_block_getinfo {
	text-align: center;
}
.login_block_getinfo div.login_block_user {
	display: block;
}
.login_block_getinfo .atoplogin, .login_block_getinfo .atoplogin:hover {
	color: #333 !important;
	font-weight: normal !important;
}
.alogin, .alogin:hover {
	font-weight: normal !important;
	padding-top: 2px;
}
.alogin:hover, .atoplogin:hover {
	text-decoration:underline !important;
}
span.fa.atoplogin, span.fa.atoplogin:hover {
    font-size: 16px;
    text-decoration: none !important;
}
.atoplogin #dropdown-icon-down, .atoplogin #dropdown-icon-up {
    font-size: 0.7em;
}
img.login, img.printer, img.entity {
	/* padding: 0px 0px 0px 4px; */
	/* margin: 0px 0px 0px 8px; */
	text-decoration: none;
	color: white;
	font-weight: bold;
}
.userimg.atoplogin img.userphoto, .userimgatoplogin img.userphoto {		/* size for user photo in login bar */
	width: 32px;
    height: 32px;
    border-radius: 50%;
    background-size: contain;
    background-size: contain;
}
img.userphoto {			/* size for user photo in lists */
	border-radius: 0.72em;
	width: 1.4em;
    height: 1.4em;
    background-size: contain;
    vertical-align: middle;
}
img.userphotosmall {			/* size for user photo in lists */
	border-radius: 0.6em;
	width: 1.2em;
    height: 1.2em;
    background-size: contain;
    vertical-align: middle;
    background-color: #FFF;
}
.span-icon-user {
	background-image: url(/theme/eldy/img/object_user.png);
	background-repeat: no-repeat;
}
.span-icon-password {
	background-image: url(/theme/eldy/img/lock.png);
	background-repeat: no-repeat;
}

/* ============================================================================== */
/* Menu gauche                                                                    */
/* ============================================================================== */

div.vmenu, td.vmenu {
    margin-right: 2px;
    position: relative;
    float: left;
    padding: 0px;
    padding-bottom: 0px;
    padding-top: 1px;
    width: 190px;
}

.vmenu {
    width: 190px;
	margin-left: 6px;
	}

/* Force vmenusearchselectcombo with type=text differently than without because beautify with select2 affect vmenusearchselectcombo differently */
input.vmenusearchselectcombo[type=text] {
	width: 180px !important;
}
.vmenusearchselectcombo {
	width: 188px;
}

.menu_contenu {
	padding-top: 3px;
	padding-bottom: 3px;
	overflow: hidden;
    text-overflow: ellipsis;
    width: 188px;				/* required to have overflow working. must be same than .menu_titre */
}
#menu_contenu_logo { /* padding-top: 0; */ }
.companylogo { }
.searchform { padding-top: 10px; }
.searchform input { font-size: 16px; }


a.vmenu:link, a.vmenu:visited, a.vmenu:hover, a.vmenu:active, span.vmenu, span.vsmenu { white-space: nowrap; font-family: roboto,arial,tahoma,verdana,helvetica; text-align: left; font-weight: bold; }	/* bold = 600, 500 is ko with Edge on 1200x960 */
font.vmenudisabled  { font-family: roboto,arial,tahoma,verdana,helvetica; text-align: left; font-weight: bold; color: #aaa; margin-left: 4px; }												/* bold = 600, 500 is ko with Edge on 1200x960 */
a.vmenu:link, a.vmenu:visited { color: #000000; }

a.vsmenu:link, a.vsmenu:visited, a.vsmenu:hover, a.vsmenu:active, span.vsmenu { font-family: roboto,arial,tahoma,verdana,helvetica; text-align: left; font-weight: normal; color: #202020; margin: 1px 1px 1px 6px; }
font.vsmenudisabled { font-family: roboto,arial,tahoma,verdana,helvetica; text-align: left; font-weight: normal; color: #aaa; }
a.vsmenu:link, a.vsmenu:visited { color: #000000; white-space: nowrap; }
font.vsmenudisabledmargin { margin: 1px 1px 1px 6px; }
li a.vsmenudisabled, li.vsmenudisabled { color: #aaa !important; }

a.help:link, a.help:visited, a.help:hover, a.help:active, span.help { font-size:0.75em; font-family: roboto,arial,tahoma,verdana,helvetica; text-align: left; font-weight: normal; color: #aaa; text-decoration: none; }

.vmenu div.blockvmenufirst, .vmenu div.blockvmenulogo, .vmenu div.blockvmenusearchphone, .vmenu div.blockvmenubookmarks
{
    border-top: 1px solid #BBB;
}
a.vsmenu.addbookmarkpicto {
    padding-right: 10px;
}
div.blockvmenusearchphone
{
	border-bottom: none !important;
}
.vmenu div.blockvmenuend, .vmenu div.blockvmenulogo
{
	margin: 0 0 8px 2px;
}
.vmenu div.blockvmenusearch
{
	padding-bottom: 4px;
/*	border-bottom: 1px solid #e0e0e0;  */
}
.vmenu div.blockvmenuend
{
	padding-bottom: 5px;
}
.vmenu div.blockvmenulogo
{
	padding-bottom: 10px;
	padding-top: 0;
}
div.blockvmenubookmarks
{
	padding-top: 10px !important;
	padding-bottom: 16px !important;
}
div.blockvmenupair, div.blockvmenuimpair, div.blockvmenubookmarks, div.blockvmenuend
{
	font-family: roboto,arial,tahoma,verdana,helvetica;
	color: #000000;
	text-align: left;
	text-decoration: none;
    padding-left: 5px;
    padding-right: 1px;
    padding-top: 4px;
    padding-bottom: 7px;
    margin: 0 0 0 2px;

	background: rgb(250,250,250);

    border-left: 1px solid #AAA;
    border-right: 1px solid #BBB;
}

div.blockvmenusearch
{
	font-family: roboto,arial,tahoma,verdana,helvetica;
	color: #000000;
	text-align: left;
	text-decoration: none;
    margin: 1px 0px 0px 2px;
	background: rgb(250,250,250);
}

div.blockvmenusearch > form > div {
	padding-top: 3px;
}
div.blockvmenusearch > form > div > label {
	padding-right: 2px;
}

div.blockvmenuhelp
{
	font-family: roboto,arial,tahoma,verdana,helvetica;
	color: #000000;
	text-align: center;
	text-decoration: none;
    padding-left: 0px;
    padding-right: 6px;
    padding-top: 3px;
    padding-bottom: 3px;
    margin: 4px 0px 0px 0px;
}


td.barre {
	border-right: 1px solid #000000;
	border-bottom: 1px solid #000000;
	background: #b3c5cc;
	font-family: roboto,arial,tahoma,verdana,helvetica;
	color: #000000;
	text-align: left;
	text-decoration: none;
}

td.barre_select {
	background: #b3c5cc;
	color: #000000;
}

td.photo {
	background: #F4F4F4;
	color: #000000;
    border: 1px solid #bbb;
}

/* ============================================================================== */
/* Panes for Main                                                   */
/* ============================================================================== */

/*
 *  PANES and CONTENT-DIVs
 */

#mainContent, #leftContent .ui-layout-pane {
    padding:    0px;
    overflow:	auto;
}

#mainContent, #leftContent .ui-layout-center {
	padding:    0px;
	position:   relative; /* contain floated or positioned elements */
    overflow:   auto;  /* add scrolling to content-div */
}


/* ============================================================================== */
/* Toolbar for ECM or Filemanager                                                 */
/* ============================================================================== */

td.ecmroot {
    padding-bottom: 0 !important;
}

.largebutton {
	/* border-top: 1px solid #CCC !important; */
    padding: 0px 4px 14px 4px !important;
    min-height: 32px;
}


a.toolbarbutton {
    margin-top: 0px;
    margin-left: 4px;
    margin-right: 4px;
    height: 30px;
}
img.toolbarbutton {
	margin-top: 1px;
    height: 30px;
}

li.expanded > a.fmdirlia.jqft.ecmjqft {
    font-weight: bold !important;
}




/* ============================================================================== */
/* Onglets                                                                        */
/* ============================================================================== */
div.tabs {
    text-align: left;
    padding-top: 10px;
    padding-left: 6px !important;
    padding-right: 6px !important;
	clear:both;
	height:100%;
}
div.tabsElem {
	margin-top: 1px;
}	/* To avoid overlap of tabs when not browser */
/*
div.tabsElem a.tabactive::before, div.tabsElem a.tabunactive::before {
    content: "\f0da";
    font-family: "Font Awesome 5 Free";
    padding-right: 2px;
    font-weight: 900;
}
*/
div.tabBar {
    color: #000000;
    padding-top: 16px;
    padding-left: 0px; padding-right: 0px;
    padding-bottom: 2px;
    margin: 0px 0px 16px 0px;
    border-top: 1px solid #BBB;
    /* border-bottom: 1px solid #AAA; */
	width: auto;
	background: rgb(255,255,255);
}
div.tabBar div.titre {
	padding-top: 20px;
}

div.tabBar.tabBarNoTop {
    padding-top: 0;
    border-top: 0;
}

/* tabBar used for creation/update/send forms */
div.tabBarWithBottom {
	padding-bottom: 18px;
	border-bottom: 1px solid #aaa;
}
div.tabBarWithBottom tr {
	background: unset !important;
}
div.tabBarWithBottom table.border>tbody>tr:last-of-type>td {
	border-bottom: none !important;
}

div.tabBar table.tableforservicepart2:last-child {
    border-bottom: 1px solid #aaa;
}
.tableforservicepart1 .tdhrthin {
	height: unset;
    padding-top: 0 !important;
}
/* Payment Screen : Pointer cursor in the autofill image */
.AutoFillAmount {
	cursor:pointer;
}

div.popuptabset {
	padding: 6px;
	background: #fff;
	border: 1px solid #888;
}
div.popuptab {
	padding-top: 5px;
	padding-bottom: 5px;
	padding-left: 5px;
	padding-right: 5px;
}

/* ============================================================================== */
/* Buttons for actions                                                            */
/* ============================================================================== */

div.tabsAction {
    margin: 20px 0em 30px 0em;
    padding: 0em 0em;
    text-align: right;
}
div.tabsActionNoBottom {
    margin-bottom: 0px;
}
div.tabsAction > a {
	margin-bottom: 16px !important;
}

a.tabTitle {
    color: rgba(0,0,0,0.4) !important;
    text-shadow:1px 1px 1px #ffffff;
	font-family: roboto,arial,tahoma,verdana,helvetica;
	font-weight: normal !important;
    padding: 4px 6px 2px 0px;
    margin-right: 10px;
    text-decoration: none;
    white-space: nowrap;
}
.imgTabTitle {
	max-height: 14px;
}

a.tabunactive {
    color: rgb(10, 20, 100) !important;
}
a.tab:link, a.tab:visited, a.tab:hover, a.tab#active {
	font-family: roboto,arial,tahoma,verdana,helvetica;
	padding: 12px 14px 13px;
    margin: 0em 0.2em;
    text-decoration: none;
    white-space: nowrap;

	border-right: 1px solid transparent;
	border-left: 1px solid transparent;
	border-top: 1px solid transparent;
	border-bottom: 0px !important;

	background-image: none !important;
}
.tabactive, a.tab#active {
	color: #000000 !important;
	background: rgb(255,255,255) !important;
	margin: 0 0.2em 0 0.2em !important;

	border-right: 1px solid #CCC !important;
	border-left: 1px solid #CCC !important;
	/* border-top: 2px solid rgb(200,200,200) !important; */
	border-top: 2px solid rgb(55,61,90) !important;
}
a.tab:hover
{
	/*
	background: rgba(255,255,255, 0.5)  url(/theme/eldy/img/nav-overlay3.png) 50% 0 repeat-x;
	color: #000000;
	*/
	text-decoration: underline;
}
a.tabimage {
    color: #434956;
	font-family: roboto,arial,tahoma,verdana,helvetica;
    text-decoration: none;
    white-space: nowrap;
}

td.tab {
    background: #dee7ec;
}

span.tabspan {
    background: #dee7ec;
    color: #434956;
	font-family: roboto,arial,tahoma,verdana,helvetica;
    padding: 0px 6px;
    margin: 0em 0.2em;
    text-decoration: none;
    white-space: nowrap;
	-webkit-border-radius:4px 4px 0px 0px;
	border-radius:4px 4px 0px 0px;

    border-right: 1px solid #555555;
    border-left: 1px solid #D8D8D8;
    border-top: 1px solid #D8D8D8;
}

/* ============================================================================== */
/* Buttons for actions                                                            */
/* ============================================================================== */
/* <style type="text/css" > */



/* ============================================================================== */
/* Buttons for actions                                                            */
/* ============================================================================== */

div.divButAction {
    margin-bottom: 1.4em;
}
div.tabsAction > a.butAction, div.tabsAction > a.butActionRefused, div.tabsAction > a.butActionDelete,
div.tabsAction > span.butAction, div.tabsAction > span.butActionRefused, div.tabsAction > span.butActionDelete {
    margin-bottom: 1.4em !important;
}
div.tabsActionNoBottom > a.butAction, div.tabsActionNoBottom > a.butActionRefused {
    margin-bottom: 0 !important;
}

span.butAction, span.butActionDelete {
    cursor: pointer;
}

.butAction {
    background: rgb(225, 231, 225)
    /* background: rgb(230, 232, 239); */
}
.butActionRefused, .butAction, .butAction:link, .butAction:visited, .butAction:hover, .butAction:active, .butActionDelete, .butActionDelete:link, .butActionDelete:visited, .butActionDelete:hover, .butActionDelete:active {
    text-decoration: none;
    text-transform: uppercase;
    font-weight: bold;

    margin: 0em 0.9em !important;
    padding: 0.6em 0.7em;
    font-family: roboto,arial,tahoma,verdana,helvetica;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    /* color: #fff; */
    /* background: rgb(55,61,90); */
    color: #444;
    /* border: 1px solid #aaa; */
    /* border-color: rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.25); */

    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}
.butActionNew, .butActionNewRefused, .butActionNew:link, .butActionNew:visited, .butActionNew:hover, .butActionNew:active {
    text-decoration: none;
    text-transform: uppercase;
    font-weight: normal;

    margin: 0em 0.3em 0 0.3em !important;
    padding: 0.2em 0.7em 0.3em;
    font-family: roboto,arial,tahoma,verdana,helvetica;
    display: inline-block;
    /* text-align: center; New button are on right of screen */
    cursor: pointer;
}

.tableforfieldcreate a.butActionNew>span.fa-plus-circle, .tableforfieldcreate a.butActionNew>span.fa-plus-circle:hover,
.tableforfieldedit a.butActionNew>span.fa-plus-circle, .tableforfieldedit a.butActionNew>span.fa-plus-circle:hover,
span.butActionNew>span.fa-plus-circle, span.butActionNew>span.fa-plus-circle:hover,
a.butActionNewRefused>span.fa-plus-circle, a.butActionNewRefused>span.fa-plus-circle:hover,
span.butActionNewRefused>span.fa-plus-circle, span.butActionNewRefused>span.fa-plus-circle:hover,
a.butActionNew>span.fa-list-alt, a.butActionNew>span.fa-list-alt:hover,
span.butActionNew>span.fa-list-alt, span.butActionNew>span.fa-list-alt:hover,
a.butActionNewRefused>span.fa-list-alt, a.butActionNewRefused>span.fa-list-alt:hover,
span.butActionNewRefused>span.fa-list-alt, span.butActionNewRefused>span.fa-list-alt:hover
{
	font-size: 1em;
	padding-left: 0px;
}

/*a.butActionNew>span.fa-plus-circle, a.butActionNew>span.fa-plus-circle:hover,
span.butActionNew>span.fa-plus-circle, span.butActionNew>span.fa-plus-circle:hover,
a.butActionNewRefused>span.fa-plus-circle, a.butActionNewRefused>span.fa-plus-circle:hover,
span.butActionNewRefused>span.fa-plus-circle, span.butActionNewRefused>span.fa-plus-circle:hover,
a.butActionNew>span.fa-list-alt, a.butActionNew>span.fa-list-alt:hover,
span.butActionNew>span.fa-list-alt, span.butActionNew>span.fa-list-alt:hover,
a.butActionNewRefused>span.fa-list-alt, a.butActionNewRefused>span.fa-list-alt:hover,
span.butActionNewRefused>span.fa-list-alt, span.butActionNewRefused>span.fa-list-alt:hover,
a.butActionNew>span.fa-comment-dots, a.butActionNew>span.fa-comment-dots:hover,
span.butActionNew>span.fa-comment-dots, span.butActionNew>span.fa-comment-dots:hover,
a.butActionNewRefused>span.fa-comment-dots, a.butActionNewRefused>span.fa-comment-dots:hover,
span.butActionNewRefused>span.fa-comment-dots, span.butActionNewRefused>span.fa-comment-dots:hover,*/
a.butActionNew>span.fa, a.butActionNew>span.fa:hover,
span.butActionNew>span.fa, span.butActionNew>span.fa:hover,
a.butActionNewRefused>span.fa, a.butActionNewRefused>span.fa:hover,
span.butActionNewRefused>span.fa, span.butActionNewRefused>span.fa:hover
{
	padding-left: 6px;
	font-size: 1.5em;
	border: none;
	box-shadow: none; webkit-box-shadow: none;
}

.butAction:hover   {
    -webkit-box-shadow: 0px 0px 6px 1px rgba(50, 50, 50, 0.4), 0px 0px 0px rgba(60,60,60,0.1);
    box-shadow: 0px 0px 6px 1px rgba(50, 50, 50, 0.4), 0px 0px 0px rgba(60,60,60,0.1);
}
.butActionNew:hover   {
    text-decoration: underline;
    box-shadow: unset !important;
}

.butActionDelete, .butActionDelete:link, .butActionDelete:visited, .butActionDelete:hover, .butActionDelete:active, .buttonDelete {
    background: rgb(234, 228, 225);
    /* border: 1px solid #633; */
    color: #633;
}

.butActionDelete:hover {
    -webkit-box-shadow: 0px 0px 6px 1px rgba(50, 50, 50, 0.4), 0px 0px 0px rgba(60,60,60,0.1);
    box-shadow: 0px 0px 6px 1px rgba(50, 50, 50, 0.4), 0px 0px 0px rgba(60,60,60,0.1);
}

.butActionRefused {
    text-decoration: none !important;
    text-transform: uppercase;
    font-weight: bold !important;

    white-space: nowrap !important;
    cursor: not-allowed !important;
    margin: 0em 0.9em;
    padding: 0.6em 0.7em;
    font-family: roboto,arial,tahoma,verdana,helvetica !important;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    color: #999 !important;
    border: 1px solid #ccc;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.butActionNewRefused, .butActionNewRefused:link, .butActionNewRefused:visited, .butActionNewRefused:hover, .butActionNewRefused:active {
    text-decoration: none !important;
    text-transform: uppercase;
    font-weight: normal !important;

    white-space: nowrap !important;
    cursor: not-allowed !important;
    margin: 0em 0.9em;
    padding: 0.2em 0.7em;
    font-family: roboto,arial,tahoma,verdana,helvetica !important;
    display: inline-block;
    /* text-align: center;  New button are on right of screen */
    cursor: pointer;
    color: #999 !important;
    padding-top: 0.2em;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
}

.butActionTransparent {
    color: #222 ! important;
    background-color: transparent ! important;
}


/*
TITLE BUTTON
 */

.btnTitle, a.btnTitle {
    display: inline-block;
    padding: 4px 12px 4px 12px;
    font-weight: 400;
    /* line-height: 1; */
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-shadow: none;
    text-decoration: none;
    position: relative;
    margin: 0 0 0 10px;
    min-width: 80px;
    text-align: center;
    color: rgb(10, 20, 100);
    border: none;
    font-size: 12px;
    font-weight: 300;
    background-color: #fbfbfb;
	border: 1px solid #fff;
}

.btnTitle > .btnTitle-icon{

}

.btnTitle > .btnTitle-label{
    color: #666666;
}

.btnTitle:hover, a.btnTitle:hover {
	border: 1px solid #bbb;
    border-radius: 3px;
    position: relative;
    margin: 0 0 0 10px;
    text-align: center;
    /* color: #ffffff;
    background-color: rgb(10, 20, 100); */
    font-size: 12px;
    text-decoration: none;
    box-shadow: none;
}

.btnTitle.refused, a.btnTitle.refused, .btnTitle.refused:hover, a.btnTitle.refused:hover {
        color: #8a8a8a;
        cursor: not-allowed;
        background-color: #fbfbfb;
        background: repeating-linear-gradient( 45deg, #ffffff, #f1f1f1 4px, #f1f1f1 4px, #f1f1f1 4px );
}

.btnTitle:hover .btnTitle-label{
    /* color: #ffffff; */
}

.btnTitle.refused .btnTitle-label, .btnTitle.refused:hover .btnTitle-label{
    color: #8a8a8a;
}

.btnTitle>.fa {
    font-size: 20px;
    display: block;
}

div.pagination li:first-child a.btnTitle{
    margin-left: 10px;
}


.imgforviewmode {
	color: #aaa;
}

/* rule to reduce top menu - 2nd reduction: Reduce width of top menu icons again */
@media only screen and (max-width: 1027px)	/* reduction 2 */
{
	.btnTitle, a.btnTitle {
	    display: inline-block;
	    padding: 4px 4px 4px 4px;
		min-width: unset;
	}
}



/*
 * BTN LINK
 */

.btn-link{
	margin-right: 5px;
	border: 1px solid #ddd;
	color: #333;
	padding: 5px 10px;
	border-radius:1em;
	text-decoration: none !important;
}

.btn-link:hover{
	background-color: #ddd;
	border: 1px solid #ddd;
}


/* ============================================================================== */
/* Tables                                                                         */
/* ============================================================================== */

.allwidth {
	width: 100%;
}

#undertopmenu {
	background-repeat: repeat-x;
	margin-top: 0px;
}


.paddingrightonly {
	border-collapse: collapse;
	border: 0px;
	margin-left: 0px;
	padding-left: 0px !important;
	padding-right: 4px !important;
}
.nocellnopadd {
	list-style-type:none;
	margin: 0px !important;
	padding: 0px !important;
}
.noborderspacing {
	border-spacing: 0;
}
tr.nocellnopadd td.nobordernopadding, tr.nocellnopadd td.nocellnopadd
{
	border: 0px;
}

.notopnoleft {
	border-collapse: collapse;
	border: 0px;
	padding-top: 0px;
	padding-left: 0px;
	padding-right: 16px;
	padding-bottom: 4px;
	margin-right: 0px;
}
.notopnoleftnoright {
	border-collapse: collapse;
	border: 0px;
	padding-top: 0px;
	padding-left: 0px;
	padding-right: 0px;
	padding-bottom: 4px;
	margin: 0px 0px 0px 0px;
}

table.tableforemailform tr td {
    padding-top: 3px;
    padding-bottom: 3px;
}

table.border, table.bordernooddeven, table.dataTable, .table-border, .table-border-col, .table-key-border-col, .table-val-border-col, div.border {
	border-collapse: collapse !important;
	padding: 1px 2px 1px 3px;			/* t r b l */
}
table.borderplus {
	border: 1px solid #BBB;
}
.border tbody tr, .bordernooddeven tbody tr, .border tbody tr td, .bordernooddeven tbody tr td, div.tabBar table.border tr, div.tabBar table.border tr td, div.tabBar div.border .table-border-row, div.tabBar div.border .table-key-border-col, div.tabBar div.border .table-val-border-col {
	height: 22px;
}
tr.liste_titre.box_titre td table td, .bordernooddeven tr td {
    height: 22px;
}

div.tabBar div.border .table-border-row, div.tabBar div.border .table-key-border-col, div.tabBar .table-val-border-col {
	vertical-align: middle;
}
div .tdtop {
    vertical-align: top !important;
	/* padding-top: 8px !important; */
	padding-bottom: 2px !important;
	padding-bottom: 0px;
}

table.border td, table.bordernooddeven td, div.border div div.tagtd {
	padding: 5px 2px 5px 2px;
	border-collapse: collapse;
}
div.tabBar .fichecenter table.border>tbody>tr>td, div.tabBar .fichecenter div.border div div.tagtd, div.tabBar div.border div div.tagtd
{
	padding-top: 5px;
	border-bottom: 1px solid #E0E0E0;
}

td.border, div.tagtable div div.border {
	border-top: 1px solid #000000;
	border-right: 1px solid #000000;
	border-bottom: 1px solid #000000;
	border-left: 1px solid #000000;
}
.table-key-border-col {
	/* width: 25%; */
	vertical-align:top;
}
.table-val-border-col {
	width:auto;
}


/* Main boxes */
.nobordertop, .nobordertop tr:first-of-type td {
    border-top: none !important;
}
.noborderbottom, .noborderbottom tr:last-of-type td {
    border-bottom: none !important;
}
.bordertop {
	border-top: 1px solid rgb(200,200,200);
}
.borderbottom {
	border-bottom: 1px solid rgb(200,200,200);
}


.fichehalfright table.noborder {
	margin: 0px 0px 0px 0px;
}
table.liste, table.noborder, table.formdoc, div.noborder {
	width: 100%;

	border-collapse: separate !important;
	border-spacing: 0px;

	border-top-width: 1px;
	border-top-color: rgb(200,200,200);
	border-top-style: solid;
	/* border-top-width: 2px;
	border-top-color: rgb(55,61,90);
	border-top-style: solid; */

	/*border-bottom-width: 1px;
	border-bottom-color: rgb(200,200,200);
	border-bottom-style: solid;*/

	margin: 0px 0px 5px 0px;
}
#tablelines {
	border-bottom-width: 1px;
	border-bottom-color: rgb(200,200,200);
	border-bottom-style: solid;
}
table.liste tr:last-of-type td, table.noborder:not(#tablelines) tr:last-of-type td, table.formdoc tr:last-of-type td, div.noborder tr:last-of-type td {
	border-bottom-width: 1px;
	border-bottom-color: rgb(200,200,200);
	border-bottom-style: solid;
}
div.tabBar div.fichehalfright table.noborder:not(.margintable):not(.paymenttable):not(.lastrecordtable):last-of-type {
    border-bottom: 1px solid rgb(200,200,200);
}
div.tabBar table.border>tbody>tr:last-of-type>td {
	border-bottom-width: 1px;
	border-bottom-color: rgb(200,200,200);
	border-bottom-style: solid;
}
div.tabBar div.fichehalfright table.noborder {
    border-bottom: none;
}

table.paddingtopbottomonly tr td {
	padding-top: 1px;
	padding-bottom: 2px;
}
.liste_titre_filter {
	background: rgb(233,234,237) !important;
}
table:not(.listwithfilterbefore) tr.liste_titre_filter:first-of-type td.liste_titre {
    padding-top: 5px;
}

tr.liste_titre_filter td.liste_titre {
	/* border-bottom: 1px solid #ddd; */
	padding-top: 1px;
	padding-bottom: 0px;
}
tr.liste_titre_filter td.liste_titre:first-of-type {
/*	height: 36px; */
}
.liste_titre_create td, .liste_titre_create th, .liste_titre_create .tagtd
{
    border-bottom-width: 0 !important;
    border-top-width: 1px;
    border-top-color: rgb(200,200,200);
    border-top-style: solid;
}
tr#trlinefordates td {
    border-bottom: 0px !important;
}
.liste_titre_add td, .liste_titre_add th, .liste_titre_add .tagtd
{
    border-top-width: 1px;
    border-top-color: rgb(200,200,200);
    border-top-style: solid;
}
table.liste tr, table.noborder tr, div.noborder form {
	border-top-color: #FEFEFE;
	min-height: 20px;
}
table.liste th, table.noborder th, table.noborder tr.liste_titre td, table.noborder tr.box_titre td {
	padding: 7px 8px 7px 8px;			/* t r b l */
}
table.liste td, table.noborder td, div.noborder form div, table.tableforservicepart1 td, table.tableforservicepart2 td {
	padding: 7px 8px 7px 8px;			/* t r b l */
	/* line-height: 22px; This create trouble on cell login on list of last events of a contract*/
	height: 22px;
}
div.liste_titre_bydiv .divsearchfield {
	padding: 2px 1px 2px 7px;			/* t r b l */
}

tr.box_titre .nobordernopadding td {
	padding: 0 ! important;
}
table.nobordernopadding {
	border-collapse: collapse !important;
	border: 0;
}
table.nobordernopadding tr {
	border: 0 !important;
	padding: 0 0 !important;
}
table.nobordernopadding tr td {
	border: 0 !important;
	padding: 0 3px 0 0;
}
table.border tr td table.nobordernopadding tr td {
	padding-top: 0;
	padding-bottom: 0;
}
td.borderright {
    border: none;	/* to erase value for table.nobordernopadding td */
	border-right-width: 1px !important;
	border-right-color: #BBB !important;
	border-right-style: solid !important;
}


/* For table with no filter before */
table.listwithfilterbefore {
	border-top: none !important;
}


.tagtable, .table-border { display: table; }
.tagtr, .table-border-row  { display: table-row; }
.tagtd, .table-border-col, .table-key-border-col, .table-val-border-col { display: table-cell; }
.confirmquestions .tagtr .tagtd:not(:first-child)  { padding-left: 10px; }
.confirmquestions { margin-top: 5px; }

/* Pagination */
div.refidpadding  {
	padding-top: 3px;
}
div.refid  {
	font-weight: bold;
  	color: rgb(0,113,121);
  	font-size: 1.2em;
}
div.refidno  {
	padding-top: 3px;
	font-weight: normal;
  	color: #444;
  	font-size: 0.86em;
  	line-height: 21px;
}
div.refidno form {
    display: inline-block;
}

div.pagination {
	float: right;
}
div.pagination a {
	font-weight: normal;
}
/*div.pagination a.butAction, div.fichehalfright a.butAction {
    margin-right: 0px !important;
}
div.tabsAction a.butActionDelete:last-child, div.tabsAction a.butAction:last-child {
    margin-right: 0px !important;
}*/
div.pagination ul
{
  list-style: none;
  display: inline-block;
  padding-left: 0px;
  padding-right: 0px;
  margin: 0;
}
div.pagination li {
  display: inline-block;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 1.1em;
}
.pagination {
  display: inline-block;
  padding-left: 0;
  border-radius: 4px;
}
div.pagination li.pagination a,
div.pagination li.pagination span {
  padding: 6px 12px;
  line-height: 1.42857143;
  color: #000;
  text-decoration: none;
  background-repeat: repeat-x;
}
div.pagination li.pagination span.inactive {
  cursor: default;
  color: #ccc;
}
li.noborder.litext, li.noborder.litext a,
div.pagination li a.inactive:hover,
div.pagination li span.inactive:hover {
  	-webkit-box-shadow: none !important;
  	box-shadow: none !important;
}
/*div.pagination li.litext {
	padding-top: 8px;
}*/
div.pagination li.litext a {
  border: none;
  padding-right: 10px;
  padding-left: 4px;
  font-weight: bold;
}
div.pagination li.litext a:hover {
	background-color: transparent;
	background-image: none;
}
div.pagination li.litext a:hover {
	background-color: transparent;
	background-image: none;
}
div.pagination li.noborder a:hover {
  border: none;
  background-color: transparent;
}
div.pagination li a,
div.pagination li span {
  /* background-color: #fff; */
  /* border: 1px solid #ddd; */
}
div.pagination li:first-child a,
div.pagination li:first-child span {
  margin-left: 0;
  /*border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;*/
}
div.pagination li:last-child a,
div.pagination li:last-child span {
  /*border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;*/
}
div.pagination li a:hover,
div.pagination li:not(.paginationafterarrows,.title-button) span:hover,
div.pagination li a:focus,
div.pagination li:not(.paginationafterarrows,.title-button) span:focus {
  -webkit-box-shadow: 0px 0px 6px 1px rgba(50, 50, 50, 0.4), 0px 0px 0px rgba(60,60,60,0.1);
  box-shadow: 0px 0px 6px 1px rgba(50, 50, 50, 0.4), 0px 0px 0px rgba(60,60,60,0.1);
}
div.pagination li .active a,
div.pagination li .active span,
div.pagination li .active a:hover,
div.pagination li .active span:hover,
div.pagination li .active a:focus,
div.pagination li .active span:focus {
  z-index: 2;
  color: #fff;
  cursor: default;
  background-color: rgb(55,61,90);
  border-color: #337ab7;
}
div.pagination .disabled span,
div.pagination .disabled span:hover,
div.pagination .disabled span:focus,
div.pagination .disabled a,
div.pagination .disabled a:hover,
div.pagination .disabled a:focus {
  color: #777;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #ddd;
}
div.pagination li.pagination .active {
  text-decoration: underline;
  box-shadow: none;
}
.paginationafterarrows .nohover {
  box-shadow: none !important;
}

div.pagination li.paginationafterarrows {
	margin-left: 10px;
	padding-top: 0;
	/*padding-bottom: 10px;*/
}
.paginationatbottom {
	margin-top: 9px;
}




/* Set the color for hover lines */
.oddeven:hover, .evenodd:hover, .impair:hover, .pair:hover
{
	background: rgb(230,237,244) !important;		/* Must be background to be stronger than background of odd or even */
}
.tredited, .tredited td {
	background: rgb(230,237,244) !important;   /* Must be background to be stronger than background of odd or even */
	border-bottom: 0 !important;
}
.treditedlinefordate {
	background: rgb(230,237,244) !important;   /* Must be background to be stronger than background of odd or even */
    border-bottom: 0px;
}
.highlight {
	background: rgb(230,237,244) !important;   /* Must be background to be stronger than background of odd or even */
}

.nohover:hover {
	background: unset;
}
.nohoverborder:hover {
	border: unset;
	box-shadow: unset;
	-webkit-box-shadow: unset;
}
.oddeven, .evenodd, .impair, .nohover .impair:hover, tr.impair td.nohover, .tagtr.oddeven
{
	font-family: roboto,arial,tahoma,verdana,helvetica;
	margin-bottom: 1px;
	color: #202020;
}
.impair, .nohover .impair:hover, tr.impair td.nohover
{
	background: #ffffff;
}
#GanttChartDIV {
	background-color: #ffffff;
}

.oddeven, .evenodd, .pair, .nohover .pair:hover, tr.pair td.nohover, .tagtr.oddeven {
	font-family: roboto,arial,tahoma,verdana,helvetica;
	margin-bottom: 1px;
	color: #202020;
}
.pair, .nohover .pair:hover, tr.pair td.nohover {
	background-color: #fafafa;
}

table.dataTable tr.oddeven {
	background-color: #fafafa !important;
}

/* For no hover style */
td.oddeven, table.nohover tr.impair, table.nohover tr.pair, table.nohover tr.impair td, table.nohover tr.pair td, tr.nohover td, form.nohover, form.nohover:hover {
	background-color: #ffffff !important;
	background: #ffffff !important;
}
td.evenodd, tr.nohoverpair td, #trlinefordates td {
	background-color: #fafafa !important;
	background: #fafafa !important;
}
.trforbreak td {
	font-weight: bold;
    border-bottom: 1pt solid black !important;
	/* background-color: #e9e4e6 !important; */
}

table.dataTable td {
    padding: 5px 8px 5px 8px !important;
}
tr.pair td, tr.impair td, form.impair div.tagtd, form.pair div.tagtd, div.impair div.tagtd, div.pair div.tagtd, div.liste_titre div.tagtd {
    padding: 7px 8px 7px 8px;
    border-bottom: 1px solid #ddd;
}
form.pair, form.impair {
	font-weight: normal;
}
form.tagtr:last-of-type div.tagtd, tr.pair:last-of-type td, tr.impair:last-of-type td {
    border-bottom: 0px !important;
}
tr.nobottom td {
    border-bottom: 0px !important;
}
div.tableforcontact form.tagtr:last-of-type div.tagtd {
    border-bottom: 1px solid #ddd !important;
}
tr.pair td .nobordernopadding tr td, tr.impair td .nobordernopadding tr td {
    border-bottom: 0px !important;
}
table.nobottomiftotal tr.liste_total td {
	background-color: #fff;
	border-bottom: 0px !important;
}
table.nobottom, td.nobottom {
	border-bottom: 0px !important;
}
div.liste_titre .tagtd {
	vertical-align: middle;
}
div.liste_titre {
	min-height: 26px !important;	/* We cant use height because it's a div and it should be higher if content is more. but min-height does not work either for div */

	padding-top: 2px;
	padding-bottom: 2px;
}
div.liste_titre_bydiv {
	border-top-width: 1px;
    border-top-color: rgb(200,200,200);
    border-top-style: solid;

	border-collapse: collapse;
	display: table;
	padding: 2px 0px 2px 0;
	box-shadow: none;
	/*width: calc(100% - 1px);	1px more, i don't know why so i remove */
	width: calc(100%);
}
tr.liste_titre, tr.liste_titre_sel, form.liste_titre, form.liste_titre_sel, table.dataTable.tr, tagtr.liste_titre
{
	height: 26px !important;
}
div.colorback	/* for the form "assign user" on time spent view */
{
	background: #f8f8f8;
	padding: 10px;
	margin-top: 5px;
	border: 1px solid #ddd;
}
div.liste_titre_bydiv, .liste_titre div.tagtr, tr.liste_titre, tr.liste_titre_sel, .tagtr.liste_titre, .tagtr.liste_titre_sel, form.liste_titre, form.liste_titre_sel, table.dataTable thead tr
{
	background: rgb(233,234,237);
	font-weight: normal;

    color: rgb(0,0,0);
    font-family: roboto,arial,tahoma,verdana,helvetica;
    text-align: left;
}
tr.liste_titre th, tr.liste_titre td, th.liste_titre
{
	border-bottom: 1px solid rgb(200,200,200);
}
tr.liste_titre:first-child th, tr:first-child th.liste_titre {
/*    border-bottom: 1px solid #ddd ! important; */
	border-bottom: unset;
}
tr.liste_titre th, th.liste_titre, tr.liste_titre td, td.liste_titre, form.liste_titre div
{
    font-family: roboto,arial,tahoma,verdana,helvetica;
    font-weight: normal;
    vertical-align: middle;
    height: 24px;
}
tr.liste_titre th a, th.liste_titre a, tr.liste_titre td a, td.liste_titre a, form.liste_titre div a, div.liste_titre a {
	text-shadow: none !important;
}
tr.liste_titre_topborder td {
	border-top-width: 1px;
    border-top-color: rgb(200,200,200);
    border-top-style: solid;
}
.liste_titre td a {
	text-shadow: none !important;
	color: rgb(0,0,0);
}
.liste_titre td a.notasortlink {
	color: rgb(10, 20, 100);
}
.liste_titre td a.notasortlink:hover {
	background: transparent;
}
tr.liste_titre:last-child th.liste_titre, tr.liste_titre:last-child th.liste_titre_sel, tr.liste_titre td.liste_titre, tr.liste_titre td.liste_titre_sel, form.liste_titre div.tagtd {				/* For last line of table headers only */
    /* border-bottom: 1px solid #ddd; */
    border-bottom: unset;
}

div.liste_titre {
	padding-left: 3px;
}
tr.liste_titre_sel th, th.liste_titre_sel, tr.liste_titre_sel td, td.liste_titre_sel, form.liste_titre_sel div
{
    font-family: roboto,arial,tahoma,verdana,helvetica;
    font-weight: normal;
    border-bottom: 1px solid #FDFFFF;
    text-decoration: underline;
}
input.liste_titre {
    background: transparent;
    border: 0px;
}
.listactionlargetitle .liste_titre {
	line-height: 24px;
}
.noborder tr.liste_total td, tr.liste_total td, form.liste_total div, .noborder tr.liste_total_wrap td, tr.liste_total_wrap td, form.liste_total_wrap div {
    color: #551188;
    font-weight: normal;
}
.noborder tr.liste_total td, tr.liste_total td, form.liste_total div {
    white-space: nowrap;
}
.noborder tr.liste_total_wrap td, tr.liste_total_wrap td, form.liste_total_wrap div {
	white-space: normal;
}
form.liste_total div {
    border-top: 1px solid #DDDDDD;
}
tr.liste_sub_total, tr.liste_sub_total td {
	border-bottom: 1px solid #aaa;
}
/* to avoid too much border on contract card */
.tableforservicepart1 .impair, .tableforservicepart1 .pair, .tableforservicepart2 .impair, .tableforservicepart2 .pair {
	background: #FFF;
}
.tableforservicepart1 tbody tr td, .tableforservicepart2 tbody tr td {
	border-bottom: none;
}
table.tableforservicepart1:first-of-type tr:first-of-type td {
    border-top: 1px solid #888;
}
table.tableforservicepart1 tr td {
    border-top: 0px;
}

.paymenttable, .margintable {
	/*border-top-width: 1px !important;
	border-top-color: rgb(200,200,200) !important;
	border-top-style: solid !important;*/
	border-top: none !important;
	margin: 0px 0px 0px 0px !important;
}
table.noborder.paymenttable {
    border-bottom: none !important;
}
.paymenttable tr td:first-child, .margintable tr td:first-child
{
	padding-left: 2px;
}
.paymenttable, .margintable tr td {
	height: 22px;
}

/* Disable-Enable shadows */
.noshadow {
	-webkit-box-shadow: 0px 0px 0px #DDD !important;
	box-shadow: 0px 0px 0px #DDD !important;
}
.shadow {
	-webkit-box-shadow: 2px 2px 5px #CCC !important;
	box-shadow: 2px 2px 5px #CCC !important;
}

div.tabBar .noborder {
	-webkit-box-shadow: 0px 0px 0px #DDD !important;
	box-shadow: 0px 0px 0px #DDD !important;
}

#tablelines tr.liste_titre td, .paymenttable tr.liste_titre td, .margintable tr.liste_titre td, .tableforservicepart1 tr.liste_titre td {
	border-bottom: 1px solid rgb(200,200,200) !important;
}
#tablelines tr td {
    height: unset;
}

/* Prepare to remove class pair - impair */

.noborder > tbody > tr:nth-child(even):not(.liste_titre), .liste > tbody > tr:nth-child(even):not(.liste_titre),
div:not(.fichecenter):not(.fichehalfleft):not(.fichehalfright):not(.ficheaddleft) > .border > tbody > tr:nth-of-type(even):not(.liste_titre), .liste > tbody > tr:nth-of-type(even):not(.liste_titre),
div:not(.fichecenter):not(.fichehalfleft):not(.fichehalfright):not(.ficheaddleft) .oddeven.tagtr:nth-of-type(even):not(.liste_titre)
{
	background: linear-gradient(bottom, rgb(255,255,255) 85%, rgb(255,255,255) 100%);
	background: -o-linear-gradient(bottom, rgb(255,255,255) 85%, rgb(255,255,255) 100%);
	background: -moz-linear-gradient(bottom, rgb(255,255,255) 85%, rgb(255,255,255) 100%);
	background: -webkit-linear-gradient(bottom, rgb(255,255,255) 85%, rgb(255,255,255) 100%);
	background: -ms-linear-gradient(bottom, rgb(255,255,255) 85%, rgb(255,255,255) 100%);
}
.noborder > tbody > tr:nth-child(even):not(:last-child) td:not(.liste_titre), .liste > tbody > tr:nth-child(even):not(:last-child) td:not(.liste_titre),
.noborder .oddeven.tagtr:nth-child(even):not(:last-child) .tagtd:not(.liste_titre)
{
	border-bottom: 1px solid #e0e0e0;
}

.noborder > tbody > tr:nth-child(odd):not(.liste_titre), .liste > tbody > tr:nth-child(odd):not(.liste_titre),
div:not(.fichecenter):not(.fichehalfleft):not(.fichehalfright):not(.ficheaddleft) > .border > tbody > tr:nth-of-type(odd):not(.liste_titre), .liste > tbody > tr:nth-of-type(odd):not(.liste_titre),
div:not(.fichecenter):not(.fichehalfleft):not(.fichehalfright):not(.ficheaddleft) .oddeven.tagtr:nth-of-type(odd):not(.liste_titre)
{
	background: linear-gradient(bottom, rgb(250,250,250) 85%, rgb(250,250,250) 100%);
	background: -o-linear-gradient(bottom, rgb(250,250,250) 85%, rgb(250,250,250) 100%);
	background: -moz-linear-gradient(bottom, rgb(250,250,250) 85%, rgb(250,250,250) 100%);
	background: -webkit-linear-gradient(bottom, rgb(250,250,250) 85%, rgb(250,250,250) 100%);
	background: -ms-linear-gradient(bottom, rgb(250,250,250) 85%, rgb(250,250,250) 100%);
}
.noborder > tbody > tr:nth-child(odd):not(:last-child) td:not(.liste_titre), .liste > tbody > tr:nth-child(odd):not(:last-child) td:not(.liste_titre),
.noborder .oddeven.tagtr:nth-child(odd):not(:last-child) .tagtd:not(.liste_titre)
{
	border-bottom: 1px solid #e0e0e0;
}

ul.noborder li:nth-child(even):not(.liste_titre) {
	background-color: rgb(250,250,250) !important;
}


/*
 *  Boxes
 */

.box {
    overflow-x: auto;
    min-height: 40px;
    padding-right: 0px;
    padding-left: 0px;
    padding-bottom: 10px;
}
.ficheaddleft div.boxstats, .ficheaddright div.boxstats {
    border: none;
}
.boxstatsborder {
    /* border: 1px solid #CCC !important; */
}
.boxstats, .boxstats130 {
    display: inline-block;
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: center;

    background: #fcfcfc;
    border: 1px solid #eee;
    border-left: 6px solid #ddd;
    box-shadow: 1px 1px 8px #ddd;
    border-radius: 0px;
}
.boxstats, .boxstats130, .boxstatscontent {
	white-space: nowrap;
	overflow: hidden;
    text-overflow: ellipsis;
}
.boxstats130 {
    width: 100%;
    height: 59px;
    /* padding: 3px; */
}
.boxstats {
    padding-left: 3px;
    padding-right: 3px;
    padding-top: 2px;
    padding-bottom: 2px;
    width: 118px;
}
.tabBar .fichehalfright .boxstats {
    padding-top: 8px;
    padding-bottom: 4px;
}
.boxstatscontent {
	padding: 3px;
}
.boxstatsempty {
    width: 121px;
    padding-left: 3px;
    padding-right: 3px;
    margin-left: 8px;
    margin-right: 8px;
}
.boxstats150empty {
    width: 158px;
    padding-left: 3px;
    padding-right: 3px;
    margin-left: 8px;
    margin-right: 8px;
}

@media only screen and (max-width: 767px)
{
	.boxstats, .boxstats130 {
		margin: 3px;
    }
    .boxstats130 {
    	text-align: left    }
	.thumbstat {
		flex: 1 1 110px;
		margin-bottom: 8px;
	    min-width: 160px;	/* on screen < 320, we guaranty to have 2 columns */
	}
	.thumbstat150 {
		flex: 1 1 110px;
		margin-bottom: 8px;
	    min-width: 160px;	/* on screen < 320, we guaranty to have 2 columns */
	    max-width: 161px;	/* on screen < 320, we guaranty to have 2 columns */
    	/* width: ...px; If I use with, there is trouble on size of flex boxes solved with min + (max that is a little bit higer than min) */
	}
    .dashboardlineindicator {
        float: left;
    	padding-left: 5px;
    }
    .boxstats {
        width: 111px;
    }
    .boxstatsempty {
    	width: 111px;
	}

}

.boxstats:hover {
	box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.20);
}
span.boxstatstext {
	opacity: 0.7;
    line-height: 18px;
    color: #000;
}
span.boxstatstext img, a.dashboardlineindicatorlate img {
	border: 0;
}
a img {
	border: 0;
}
.boxstatsindicator.thumbstat150 {	/* If we remove this, box position is ko on ipad */
	display: inline-flex;
}
span.boxstatsindicator {
	font-size: 130%;
	font-weight: normal;
	line-height: 29px;
	flex-grow: 1;

}
span.dashboardlineindicator, span.dashboardlineindicatorlate {
	font-size: 130%;
	font-weight: normal;
}
a.dashboardlineindicatorlate:hover {
	text-decoration: none;
}
.dashboardlineindicatorlate img {
	width: 16px;
}
span.dashboardlineok {
	color: #008800;
}
span.dashboardlineko {
	color: #FFF;
	font-size: 80%;
}
.dashboardlinelatecoin {
	float: right;
	position: relative;
    text-align: right;
    top: -27px;
    right: 2px;
    padding: 0px 5px 0px 5px;
    border-radius: .25em;

    background-color: #9f4705;
}
.imglatecoin {
    padding: 1px 3px 1px 1px;
    margin-left: 4px;
    margin-right: 2px;
    background-color: #8c4446;
    color: #FFFFFF ! important;
    border-radius: .25em;
	display: inline-block;
	vertical-align: middle;
}
.boxtable {
    margin-bottom: 25px !important;
    border-bottom-width: 1px;

    border-top: 1px solid rgb(200,200,200);
	/* border-top: 2px solid rgb(55,61,90) !important; */
}
table.noborder.boxtable tr td {
    height: unset;
}
.boxtablenotop {
    border-top-width: 0 !important;
}
.boxtablenobottom {
    border-bottom-width: 0 !important;
}
.boxtable .fichehalfright, .boxtable .fichehalfleft {
    min-width: 275px;	/* increasing this, make chart on box not side by side on laptops */
}
.tdboxstats {
	text-align: center;
}
.boxworkingboard .tdboxstats {
	padding-left: 0px !important;
	padding-right: 0px !important;
}
a.valignmiddle.dashboardlineindicator {
    line-height: 30px;
}

tr.box_titre {
    height: 26px;

    /* TO MATCH BOOTSTRAP */
	/*background: #ddd;
	color: #000 !important;*/

	/* TO MATCH ELDY */
	background: rgb(233,234,237)
	color: rgb(0,0,0);
    font-family: roboto,arial,tahoma,verdana,helvetica, sans-serif;
    font-weight: normal;
    border-bottom: 1px solid #FDFFFF;
    white-space: nowrap;
}

tr.box_titre td.boxclose {
	width: 30px;
}
img.boxhandle, img.boxclose {
	padding-left: 5px;
}

.formboxfilter {
	vertical-align: middle;
	margin-bottom: 6px;
}
.formboxfilter input[type=image]
{
	top: 5px;
	position: relative;
}
.boxfilter {
	margin-bottom: 2px;
	margin-right: 1px;
}
.prod_entry_mode_free, .prod_entry_mode_predef {
    height: 26px !important;
    vertical-align: middle;
}

.modulebuilderbox {
	border: 1px solid #888;
	padding: 16px;
}


/*
 *   Ok, Warning, Error
 */

.ok      { color: #114466; }
.warning { color: #887711 !important; }
.error   { color: #660000 !important; font-weight: bold; }
.green   { color: #118822; }

div.ok {
  color: #114466;
}

/* Info admin */
div.info {
	border-left: solid 5px #87cfd2;
    padding-top: 8px;
    padding-left: 10px;
    padding-right: 4px;
    padding-bottom: 8px;
    margin: 1em 0em 1em 0em;
    background: #eff8fc;
    color: #666;
}

/* Warning message */
div.warning {
    border-left: solid 5px #f2cf87;
	padding-top: 8px;
	padding-left: 10px;
	padding-right: 4px;
	padding-bottom: 8px;
	margin: 1em 0em 1em 0em;
    background: #fcf8e3;
}
div.warning a, div.info a, div.error a {
	color: rgb(10, 20, 100);
}

/* Error message */
div.error {
    border-left: solid 5px #f28787;
	padding-top: 8px;
	padding-left: 10px;
	padding-right: 4px;
	padding-bottom: 8px;
	margin: 1em 0em 1em 0em;
  background: #EFCFCF;
}


/*
 *   Liens Payes/Non payes
 */

a.normal:link { font-weight: normal }
a.normal:visited { font-weight: normal }
a.normal:active { font-weight: normal }
a.normal:hover { font-weight: normal }

a.impayee:link { font-weight: bold; color: #550000; }
a.impayee:visited { font-weight: bold; color: #550000; }
a.impayee:active { font-weight: bold; color: #550000; }
a.impayee:hover { font-weight: bold; color: #550000; }


/*
 *  External web site
 */

.framecontent {
    width: 100%;
    height: 100%;
}

.framecontent iframe {
    width: 100%;
    height: 100%;
}


/*
 *  Other
 */

.opened-dash-board-wrap {
    margin-bottom: 25px;
}

div.boximport {
    min-height: unset;
}

.product_line_stock_ok { color: #002200; }
.product_line_stock_too_low { color: #884400; }

.fieldrequired { font-weight: bold; color: #000055; }

.widthpictotitle { width: 44px; text-align: left; }
span.widthpictotitle { font-size: 2.5em; };

.dolgraphtitle { margin-top: 6px; margin-bottom: 4px; }
.dolgraphtitlecssboxes { /* margin: 0px; */ }
.legendColorBox, .legendLabel { border: none !important; }
div.dolgraph div.legend, div.dolgraph div.legend div { background-color: rgba(255,255,255,0) !important; }
div.dolgraph div.legend table tbody tr { height: auto; }
td.legendColorBox { padding: 2px 2px 2px 0 !important; }
td.legendLabel { padding: 2px 2px 2px 0 !important; }
td.legendLabel {
    text-align: left;
}

label.radioprivate {
    white-space: nowrap;
}

.photo {
	border: 0px;
}
.photowithmargin {
	margin-bottom: 2px;
	margin-top: 10px;
}
div.divphotoref > a > .photowithmargin {		/* Margin right for photo not inside a div.photoref frame only */
    margin-right: 15px;
}
.photowithborder {
	border: 1px solid #f0f0f0;
}
.photointooltip {
	margin-top: 6px;
	margin-bottom: 6px;
	text-align: center;
}
.photodelete {
	margin-top: 6px !important;
}

.logo_setup
{
	content:url(/theme/eldy/img/logo_setup.svg);	/* content is used to best fit the container */
	display: inline-block;
}
.nographyet
{
	content:url(/theme/eldy/img/nographyet.svg);
	display: inline-block;
    opacity: 0.1;
    background-repeat: no-repeat;
}
.nographyettext
{
    opacity: 0.5;
}

div.titre {
	font-size: 1.1em;
	text-decoration: none;
	padding-top: 5px;
    padding-bottom: 5px;
}
div.titre, .secondary {
	font-family: roboto,arial,tahoma,verdana,helvetica;
	color: rgb(0,113,121);
}

table.table-fiche-title .col-title div.titre{
	line-height: 40px;
}
table.table-fiche-title {
	margin-bottom: 5px;
}


div.backgreypublicpayment { background-color: #f0f0f0; padding: 20px; border-bottom: 1px solid #ddd; }
.backgreypublicpayment a { color: #222 !important; }
.poweredbypublicpayment {
	float: right;
	top: 8px;
    right: 8px;
    position: absolute;
    font-size: 0.8em;
    color: #222;
    opacity: 0.3;
}
#dolpaymenttable { min-width: 320px; font-size: 16px; }	/* Width must have min to make stripe input area visible. Lower than 320 makes input area crazy for credit card that need zip code */
#tablepublicpayment { border: 1px solid #CCCCCC !important; width: 100%; padding: 20px; }
#tablepublicpayment .CTableRow1  { background-color: #F0F0F0 !important; }
#tablepublicpayment tr.liste_total { border-bottom: 1px solid #CCCCCC !important; }
#tablepublicpayment tr.liste_total td { border-top: none; }

.divmainbodylarge { margin-left: 40px; margin-right: 40px; }
#divsubscribe { max-width: 900px; }
#tablesubscribe { width: 100%; }

div#card-element {
    border: 1px solid #ccc;
}
div#card-errors {
	color: #fa755a;
    text-align: center;
    padding-top: 3px;
    max-width: 320px;
}


/*
 * Effect Postit
 */
.effectpostit
{
  position: relative;
}
.effectpostit:before, .effectpostit:after
{
  z-index: -1;
  position: absolute;
  content: "";
  bottom: 15px;
  left: 10px;
  width: 50%;
  top: 80%;
  max-width:300px;
  background: #777;
  -webkit-box-shadow: 0 15px 10px #777;
  box-shadow: 0 15px 10px #777;
  -webkit-transform: rotate(-3deg);
  -moz-transform: rotate(-3deg);
  -o-transform: rotate(-3deg);
  -ms-transform: rotate(-3deg);
  transform: rotate(-3deg);
}
.effectpostit:after
{
  -webkit-transform: rotate(3deg);
  -moz-transform: rotate(3deg);
  -o-transform: rotate(3deg);
  -ms-transform: rotate(3deg);
  transform: rotate(3deg);
  right: 10px;
  left: auto;
}



/* ============================================================================== */
/* Formulaire confirmation (When Ajax JQuery is used)                             */
/* ============================================================================== */

.ui-dialog-titlebar {
}
.ui-dialog-content {
}


/* ============================================================================== */
/* For content of image preview                                                   */
/* ============================================================================== */

/*
.ui-dialog-content.ui-widget-content > object {
     max-height: none;
     width: auto; margin-left: auto; margin-right: auto; display: block;
}
*/


/* ============================================================================== */
/* Formulaire confirmation (When HTML is used)                                    */
/* ============================================================================== */

table.valid {
    /* border-top: solid 1px #E6E6E6; */
    border-left: solid 5px #f2cf87;
    /* border-right: solid 1px #444444;
    border-bottom: solid 1px #555555; */
	padding-top: 8px;
	padding-left: 10px;
	padding-right: 4px;
	padding-bottom: 4px;
	margin: 0px 0px;
    background: #fcf8e3;
}

.validtitre {
	font-weight: bold;
}


/* ============================================================================== */
/* Tooltips                                                                       */
/* ============================================================================== */

/* For tooltip using dialog */
.ui-dialog.highlight.ui-widget.ui-widget-content.ui-front {
    z-index: 3000;
}

div.ui-tooltip {
	max-width: 600px !important;
}
div.ui-tooltip.mytooltip {
	border: none !important;
	padding: 10px 15px;
	border-radius: 0;
	margin: 2px;
	font-stretch: condensed;
	-moz-box-shadow:   0.5px 0.5px 4px 0px rgba(0, 0, 0, 0.5);
	-webkit-box-shadow:0.5px 0.5px 4px 0px rgba(0, 0, 0, 0.5);
	-o-box-shadow:     0.5px 0.5px 4px 0px rgba(0, 0, 0, 0.5);
	box-shadow:        0.5px 0.5px 4px 0px rgba(0, 0, 0, 0.5);
	filter:progid:DXImageTransform.Microsoft.Shadow(color=#656565, Direction=134, Strength=5);
	background: rgba(255, 255, 255, 0.96) !important;
	color : #333;
}




/* ============================================================================== */
/* Calendar                                                                       */
/* ============================================================================== */

.ui-datepicker-calendar .ui-state-default, .ui-datepicker-calendar .ui-widget-content .ui-state-default,
.ui-datepicker-calendar .ui-widget-header .ui-state-default, .ui-datepicker-calendar .ui-button,
html .ui-datepicker-calendar .ui-button.ui-state-disabled:hover, html .ui-button.ui-state-disabled:active
{
    border: unset;
}

img.datecallink { padding-left: 2px !important; padding-right: 2px !important; }

.ui-datepicker-trigger {
	vertical-align: middle;
	cursor: pointer;
	padding-left: 2px;
	padding-right: 2px;
}

.bodyline {
	-webkit-border-radius: 8px;
	border-radius: 8px;
	border: 1px #E4ECEC outset;
	padding: 0px;
	margin-bottom: 5px;
}
table.dp {
    width: 180px;
    background-color: #FFFFFF;
    border-top: solid 2px #DDDDDD;
    border-left: solid 2px #DDDDDD;
    border-right: solid 1px #222222;
    border-bottom: solid 1px #222222;
    padding: 0px;
	border-spacing: 0px;
	border-collapse: collapse;
}
.dp td, .tpHour td, .tpMinute td{padding:2px; font-size:10px;}
/* Barre titre */
.dpHead,.tpHead,.tpHour td:Hover .tpHead{
	font-weight:bold;
	background-color:#b3c5cc;
	color:white;
	font-size:11px;
	cursor:auto;
}
/* Barre navigation */
.dpButtons,.tpButtons {
	text-align:center;
	background-color:#617389;
	color:#FFFFFF;
	font-weight:bold;
	cursor:pointer;
}
.dpButtons:Active,.tpButtons:Active{border: 1px outset black;}
.dpDayNames td,.dpExplanation {background-color:#D9DBE1; font-weight:bold; text-align:center; font-size:11px;}
.dpExplanation{ font-weight:normal; font-size:11px;}
.dpWeek td{text-align:center}

.dpToday,.dpReg,.dpSelected{
	cursor:pointer;
}
.dpToday{font-weight:bold; color:black; background-color:#DDDDDD;}
.dpReg:Hover,.dpToday:Hover{background-color:black;color:white}

/* Jour courant */
.dpSelected{background-color:#0B63A2;color:white;font-weight:bold; }

.tpHour{border-top:1px solid #DDDDDD; border-right:1px solid #DDDDDD;}
.tpHour td {border-left:1px solid #DDDDDD; border-bottom:1px solid #DDDDDD; cursor:pointer;}
.tpHour td:Hover {background-color:black;color:white;}

.tpMinute {margin-top:5px;}
.tpMinute td:Hover {background-color:black; color:white; }
.tpMinute td {background-color:#D9DBE1; text-align:center; cursor:pointer;}

/* Bouton X fermer */
.dpInvisibleButtons
{
    border-style:none;
    background-color:transparent;
    padding:0px;
    font-size: 0.85em;
    border-width:0px;
    color:#0B63A2;
    vertical-align:middle;
    cursor: pointer;
}
.datenowlink
{
	color: rgb(10, 20, 100);
}


/* ============================================================================== */
/*  Afficher/cacher                                                               */
/* ============================================================================== */

div.visible {
    display: block;
}

div.hidden, td.hidden, img.hidden, span.hidden {
    display: none;
}

tr.visible {
    display: block;
}


/* ============================================================================== */
/*  Module website                                                                */
/* ============================================================================== */

.phptag {
	background: #ddd; border: 1px solid #ccc; border-radius: 4px;
}

.nobordertransp {
    border: 0px;
    background-color: transparent;
    background-image: none;
}
.bordertransp {
    background-color: transparent;
    background-image: none;
    border: none;
	font-weight: normal;
}
.websitebar {
	border-bottom: 1px solid #ccc;
	background: #e6e6e6;
	display: inline-block;
	padding: 4px 0 4px 0;
}
.websitebar .buttonDelete, .websitebar .button {
	text-shadow: none;
}
.websitebar .button, .websitebar .buttonDelete
{
	padding: 2px 5px 3px 5px !important;
	margin: 2px 4px 2px 4px  !important;
    line-height: normal;
}
.websiteselection {
	/* display: inline-block; */
	padding-left: 10px;
	vertical-align: middle;
	/* line-height: 28px; */
}
.websitetools {
	float: right;
}
.websiteselection, .websitetools {
	/* margin-top: 3px;
	padding-top: 3px;
	padding-bottom: 3px; */
}
.websiteinputurl {
    display: inline-block;
    vertical-align: top;
    line-height: 28px;
}
.websiteiframenoborder {
	border: 0px;
}
span.websitebuttonsitepreview, a.websitebuttonsitepreview {
	vertical-align: middle;
}
span.websitebuttonsitepreview img, a.websitebuttonsitepreview img {
	width: 26px;
	display: inline-block;
}
span.websitebuttonsitepreviewdisabled img, a.websitebuttonsitepreviewdisabled img {
	opacity: 0.2;
}
.websitehelp {
    vertical-align: middle;
    float: right;
    padding-top: 8px;
}
.websiteselectionsection {
	border-left: 1px solid #bbb;
	border-right: 1px solid #bbb;
	margin-left: 0px;
	padding-left: 8px;
	margin-right: 5px;
}
.websitebar input#previewpageurl {
    line-height: 1em;
}



/* ============================================================================== */
/*  Module agenda                                                                 */
/* ============================================================================== */

.dayevent .tagtr:first-of-type {
    height: 24px;
}

.agendacell { height: 60px; }
table.cal_month    { border-spacing: 0px;  }
table.cal_month td:first-child  { border-left: 0px; }
table.cal_month td:last-child   { border-right: 0px; }
.cal_current_month { border-top: 0; border-left: solid 1px #E0E0E0; border-right: 0; border-bottom: solid 1px #E0E0E0; }
.cal_current_month_peruserleft { border-top: 0; border-left: solid 2px #6C7C7B; border-right: 0; border-bottom: solid 1px #E0E0E0; }
.cal_current_month_oneday { border-right: solid 1px #E0E0E0; }
.cal_other_month   { border-top: 0; border-left: solid 1px #C0C0C0; border-right: 0; border-bottom: solid 1px #C0C0C0; }
.cal_other_month_peruserleft { border-top: 0; border-left: solid 2px #6C7C7B !important; border-right: 0; }
.cal_current_month_right { border-right: solid 1px #E0E0E0; }
.cal_other_month_right   { border-right: solid 1px #C0C0C0; }
.cal_other_month   { /* opacity: 0.6; */ background: #EAEAEA; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_past_month    { /* opacity: 0.6; */ background: #EEEEEE; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_current_month { background: #FFFFFF; border-left: solid 1px #E0E0E0; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_current_month_peruserleft { background: #FFFFFF; border-left: solid 2px #6C7C7B; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_today         { background: #FDFDF0; border-left: solid 1px #E0E0E0; border-bottom: solid 1px #E0E0E0; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_today_peruser { background: #FDFDF0; border-right: solid 1px #E0E0E0; border-bottom: solid 1px #E0E0E0; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_today_peruser_peruserleft { background: #FDFDF0; border-left: solid 2px #6C7C7B; border-right: solid 1px #E0E0E0; border-bottom: solid 1px #E0E0E0; padding-left: 2px; padding-right: 1px; padding-top: 0px; padding-bottom: 0px; }
.cal_past          { }
.cal_peruser       { padding-top: 0 !important; padding-bottom: 0 !important; padding-left: 1px !important; padding-right: 1px !important; }
.cal_impair        { background: #F8F8F8; }
.cal_today_peruser_impair { background: #F8F8F0; }
.peruser_busy      { }
.peruser_notbusy   { opacity: 0.5; }
table.cal_event    { border: none; border-collapse: collapse; margin-bottom: 1px; min-height: 20px; }
table.cal_event td { border: none; padding-left: 2px; padding-right: 2px; padding-top: 0px; padding-bottom: 0px; }
table.cal_event td.cal_event { padding: 4px 4px !important; }
table.cal_event td.cal_event_right { padding: 4px 4px !important; }
.cal_event              { font-size: 1em; }
.cal_event a:link       { color: #111111; font-weight: normal !important; }
.cal_event a:visited    { color: #111111; font-weight: normal !important; }
.cal_event a:active     { color: #111111; font-weight: normal !important; }
.cal_event_busy a:hover { color: #111111; font-weight: normal !important; color:rgba(255,255,255,.75); }
.cal_event_busy      { }
.cal_peruserviewname { max-width: 140px; height: 22px; }

.calendarviewcontainertr { height: 100px; }

td.cal_other_month {
	opacity: 0.8;
}



/* ============================================================================== */
/*  Ajax - Liste deroulante de l'autocompletion                                   */
/* ============================================================================== */

.ui-widget-content { border: solid 1px rgba(0,0,0,.3); background: #fff !important; }

.ui-autocomplete-loading { background: white url(/theme/eldy/img/working.gif) right center no-repeat; }
.ui-autocomplete {
	       position:absolute;
	       width:auto;
	       font-size: 1.0em;
	       background-color:white;
	       border:1px solid #888;
	       margin:0px;
/*	       padding:0px; This make combo crazy */
	     }
.ui-autocomplete ul {
	       list-style-type:none;
	       margin:0px;
	       padding:0px;
	     }
.ui-autocomplete ul li.selected { background-color: #D3E5EC;}
.ui-autocomplete ul li {
	       list-style-type:none;
	       display:block;
	       margin:0;
	       padding:2px;
	       height:18px;
	       cursor:pointer;
	     }


/* ============================================================================== */
/*  jQuery - jeditable for inline edit                                            */
/* ============================================================================== */

.editkey_textarea, .editkey_ckeditor, .editkey_string, .editkey_email, .editkey_numeric, .editkey_select, .editkey_autocomplete {
	background: url(/theme/eldy/img/edit.png) right top no-repeat;
	cursor: pointer;
	margin-right: 3px;
	margin-top: 3px;
}

.editkey_datepicker {
	background: url(/theme/eldy/img/calendar.png) right center no-repeat;
	margin-right: 3px;
	cursor: pointer;
	margin-right: 3px;
	margin-top: 3px;
}

.editval_textarea.active:hover, .editval_ckeditor.active:hover, .editval_string.active:hover, .editval_email.active:hover, .editval_numeric.active:hover, .editval_select.active:hover, .editval_autocomplete.active:hover, .editval_datepicker.active:hover {
	background: white;
	cursor: pointer;
}

.viewval_textarea.active:hover, .viewval_ckeditor.active:hover, .viewval_string.active:hover, .viewval_email.active:hover, .viewval_numeric.active:hover, .viewval_select.active:hover, .viewval_autocomplete.active:hover, .viewval_datepicker.active:hover {
	background: white;
	cursor: pointer;
}

.viewval_hover {
	background: white;
}


/* ============================================================================== */
/* Admin Menu                                                                     */
/* ============================================================================== */

/* CSS for treeview */
.treeview ul { background-color: transparent !important; margin-top: 4px; padding-top: 4px !important; }
.treeview li { background-color: transparent !important; padding: 0 0 0 16px !important; min-height: 26px; }
.treeview .hover { color: rgb(10, 20, 100) !important; text-decoration: underline !important; }



/* ============================================================================== */
/*  Show Excel tabs                                                               */
/* ============================================================================== */

.table_data
{
	border-style:ridge;
	border:1px solid;
}
.tab_base
{
	background:#C5D0DD;
	font-weight:bold;
	border-style:ridge;
	border: 1px solid;
	cursor:pointer;
}
.table_sub_heading
{
	background:#CCCCCC;
	font-weight:bold;
	border-style:ridge;
	border: 1px solid;
}
.table_body
{
	background:#F0F0F0;
	font-weight:normal;
	font-family:sans-serif;
	border-style:ridge;
	border: 1px solid;
	border-spacing: 0px;
	border-collapse: collapse;
}
.tab_loaded
{
	background:#222222;
	color:white;
	font-weight:bold;
	border-style:groove;
	border: 1px solid;
	cursor:pointer;
}


/* ============================================================================== */
/*  CSS for color picker                                                          */
/* ============================================================================== */

A.color, A.color:active, A.color:visited {
 position : relative;
 display : block;
 text-decoration : none;
 width : 10px;
 height : 10px;
 line-height : 10px;
 margin : 0px;
 padding : 0px;
 border : 1px inset white;
}
A.color:hover {
 border : 1px outset white;
}
A.none, A.none:active, A.none:visited, A.none:hover {
 position : relative;
 display : block;
 text-decoration : none;
 width : 10px;
 height : 10px;
 line-height : 10px;
 margin : 0px;
 padding : 0px;
 cursor : default;
 border : 1px solid #b3c5cc;
}
.tblColor {
 display : none;
}
.tdColor {
 padding : 1px;
}
.tblContainer {
 background-color : #b3c5cc;
}
.tblGlobal {
 position : absolute;
 top : 0px;
 left : 0px;
 display : none;
 background-color : #b3c5cc;
 border : 2px outset;
}
.tdContainer {
 padding : 5px;
}
.tdDisplay {
 width : 50%;
 height : 20px;
 line-height : 20px;
 border : 1px outset white;
}
.tdDisplayTxt {
 width : 50%;
 height : 24px;
 line-height : 12px;
 font-family : roboto,arial,tahoma,verdana,helvetica;
 font-size : 8pt;
 color : black;
 text-align : center;
}
.btnColor {
 width : 100%;
 font-family : roboto,arial,tahoma,verdana,helvetica;
 font-size : 10pt;
 padding : 0px;
 margin : 0px;
}
.btnPalette {
 width : 100%;
 font-family : roboto,arial,tahoma,verdana,helvetica;
 font-size : 8pt;
 padding : 0px;
 margin : 0px;
}


/* Style to overwrites JQuery styles */
.ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight {
    border: 1px solid #888;
    background: rgb(233,234,237);
    color: unset;
}

.ui-menu .ui-menu-item a {
    text-decoration:none;
    display:block;
    padding:.2em .4em;
    line-height:1.5;
    font-weight: normal;
    font-family:roboto,arial,tahoma,verdana,helvetica;
    font-size:1em;
}
.ui-widget {
    font-family:roboto,arial,tahoma,verdana,helvetica;
}
/* .ui-button { margin-left: -2px; padding-top: 1px; } */
.ui-button { margin-left: -2px; }
.ui-button-icon-only .ui-button-text { height: 8px; }
.ui-button-icon-only .ui-button-text, .ui-button-icons-only .ui-button-text { padding: 2px 0px 6px 0px; }
.ui-button-text
{
    line-height: 1em !important;
}
.ui-autocomplete-input { margin: 0; padding: 4px; }


/* ============================================================================== */
/*  CKEditor                                                                      */
/* ============================================================================== */

body.cke_show_borders {
    margin: 5px !important;
}

.cke_dialog {
    border: 1px #bbb solid ! important;
}
/*.cke_editor table, .cke_editor tr, .cke_editor td
{
    border: 0px solid #FF0000 !important;
}
span.cke_skin_kama { padding: 0 !important; }*/
.cke_wrapper { padding: 4px !important; }
a.cke_dialog_ui_button
{
    font-family: roboto,arial,tahoma,verdana,helvetica !important;
	background-image: url(/theme/eldy/img/button_bg.png) !important;
	background-position: bottom !important;
    border: 1px solid #C0C0C0 !important;
	-webkit-border-radius:0px 5px 0px 5px !important;
	border-radius:0px 5px 0px 5px !important;
    -webkit-box-shadow: 3px 3px 4px #DDD !important;
    box-shadow: 3px 3px 4px #DDD !important;
}
.cke_dialog_ui_hbox_last
{
	vertical-align: bottom ! important;
}
/*
.cke_editable
{
	line-height: 1.4 !important;
	margin: 6px !important;
}
*/
a.cke_dialog_ui_button_ok span {
    text-shadow: none !important;
    color: #333 !important;
}


/* ============================================================================== */
/*  ACE editor                                                                    */
/* ============================================================================== */
.ace_editor {
    border: 1px solid #ddd;
	margin: 0;
}
.aceeditorstatusbar {
        margin: 0;
        padding: 0;
        padding-left: 10px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ebebeb;
        height: 28px;
        line-height: 2.2em;
}
.ace_status-indicator {
        color: gray;
        position: relative;
        right: 0;
        border-left: 1px solid;
}
pre#editfilecontentaceeditorid {
    margin-top: 5px;
}


/* ============================================================================== */
/*  File upload                                                                   */
/* ============================================================================== */

.template-upload {
    height: 72px !important;
}


/* ============================================================================== */
/*  Holiday                                                                       */
/* ============================================================================== */

#types .btn {
    cursor: pointer;
}

#types .btn-primary {
    font-weight: bold;
}

#types form {
    padding: 20px;
}

#types label {
    display:inline-block;
    width:100px;
    margin-right: 20px;
    padding: 4px;
    text-align: right;
    vertical-align: top;
}

#types input.text, #types textarea {
    width: 400px;
}

#types textarea {
    height: 100px;
}


/* ============================================================================== */
/*  Comments                                                                   	  */
/* ============================================================================== */

#comment div {
	box-sizing:border-box;
}
#comment .comment {
    border-radius:7px;
    margin-bottom:10px;
    overflow:hidden;
}
#comment .comment-table {
    display:table;
    height:100%;
}
#comment .comment-cell {
    display:table-cell;
}
#comment .comment-info {
    font-size:0.8em;
    border-right:1px solid #dedede;
    margin-right:10px;
    width:160px;
    text-align:center;
    background:rgba(255,255,255,0.5);
    vertical-align:middle;
    padding:10px 2px;
}
#comment .comment-info a {
    color:inherit;
}
#comment .comment-right {
    vertical-align:top;
}
#comment .comment-description {
    padding:10px;
    vertical-align:top;
}
#comment .comment-delete {
    width: 100px;
    text-align:center;
    vertical-align:middle;
}
#comment .comment-delete:hover {
    background:rgba(250,20,20,0.8);
}
#comment .comment-edit {
    width: 100px;
    text-align:center;
    vertical-align:middle;
}
#comment .comment-edit:hover {
    background:rgba(0,184,148,0.8);
}
#comment textarea {
    width: 100%;
}



/* ============================================================================== */
/*  JSGantt                                                                       */
/* ============================================================================== */

div.scroll2 {
	width: 450px !important;
}

.gtaskname div, .gtaskname {
	font-size: unset !important;
}
div.gantt, .gtaskheading, .gmajorheading, .gminorheading, .gminorheadingwkend {
	font-size: unset !important;
	font-weight: normal !important;
	color: #000 !important;
}
div.gTaskInfo {
    background: #f0f0f0 !important;
}
.gtaskblue {
	background: rgb(108,152,185) !important;
}
.gtaskgreen {
    background: rgb(160,173,58) !important;
}
td.gtaskname {
    overflow: hidden;
    text-overflow: ellipsis;
}
td.gminorheadingwkend {
    color: #888 !important;
}
td.gminorheading {
    color: #666 !important;
}
.glistlbl, .glistgrid {
	width: 582px !important;
}
.gtaskname div, .gtaskname {
    min-width: 250px !important;
    max-width: 250px !important;
    width: 250px !important;
}
.gpccomplete div, .gpccomplete {
    min-width: 40px !important;
    max-width: 40px !important;
    width: 40px !important;
}


/* ============================================================================== */
/*  jFileTree                                                                     */
/* ============================================================================== */

.ecmfiletree {
	width: 99%;
	height: 99%;
	padding-left: 2px;
	font-weight: normal;
}

.fileview {
	width: 99%;
	height: 99%;
	background: #FFF;
	padding-left: 2px;
	padding-top: 4px;
	font-weight: normal;
}

div.filedirelem {
    position: relative;
    display: block;
    text-decoration: none;
}

ul.filedirelem {
    padding: 2px;
    margin: 0 5px 5px 5px;
}
ul.filedirelem li {
    list-style: none;
    padding: 2px;
    margin: 0 10px 20px 10px;
    width: 160px;
    height: 120px;
    text-align: center;
    display: block;
    float: left;
    border: solid 1px #DDDDDD;
}

ul.ecmjqft {
	line-height: 16px;
	padding: 0px;
	margin: 0px;
	font-weight: normal;
}

ul.ecmjqft li {
	list-style: none;
	padding: 0px;
	padding-left: 20px;
	margin: 0px;
	white-space: nowrap;
	display: block;
}

ul.ecmjqft a {
	line-height: 24px;
	vertical-align: middle;
	color: #333;
	padding: 0px 0px;
	font-weight:normal;
	display: inline-block !important;
}
ul.ecmjqft a:active {
	font-weight: bold !important;
}
ul.ecmjqft a:hover {
    text-decoration: underline;
}
div.ecmjqft {
	vertical-align: middle;
	display: inline-block !important;
	text-align: right;
	float: right;
	right:4px;
	clear: both;
}
div#ecm-layout-west {
    width: 380px;
    vertical-align: top;
}
div#ecm-layout-center {
    width: calc(100% - 390px);
    vertical-align: top;
    float: right;
}

.ecmjqft LI.directory { font-weight:normal; background: url(/theme/common/treemenu/folder2.png) left top no-repeat; }
.ecmjqft LI.expanded { font-weight:normal; background: url(/theme/common/treemenu/folder2-expanded.png) left top no-repeat; }
.ecmjqft LI.wait { font-weight:normal; background: url(/theme/eldy/img/working.gif) left top no-repeat; }


/* ============================================================================== */
/*  jNotify                                                                       */
/* ============================================================================== */

.jnotify-container {
	position: fixed !important;
	text-align: center;
	min-width: 480px;
	width: auto;
	max-width: 1024px;
	padding-left: 10px !important;
	padding-right: 10px !important;
	word-wrap: break-word;
}
.jnotify-container .jnotify-notification .jnotify-message {
	font-weight: normal;
}
.jnotify-container .jnotify-notification-warning .jnotify-close, .jnotify-container .jnotify-notification-warning .jnotify-message {
    color: #a28918 !important;
}

/* use or not ? */
div.jnotify-background {
	opacity : 0.95 !important;
    -webkit-box-shadow: 2px 2px 4px #888 !important;
    box-shadow: 2px 2px 4px #888 !important;
}

/* ============================================================================== */
/*  blockUI                                                                      */
/* ============================================================================== */

/*div.growlUI { background: url(check48.png) no-repeat 10px 10px }*/
div.dolEventValid h1, div.dolEventValid h2 {
	color: #567b1b;
	background-color: #e3f0db;
	padding: 5px 5px 5px 5px;
	text-align: left;
}
div.dolEventError h1, div.dolEventError h2 {
	color: #a72947;
	background-color: #d79eac;
	padding: 5px 5px 5px 5px;
	text-align: left;
}

/* ============================================================================== */
/*  Maps                                                                          */
/* ============================================================================== */

.divmap, #google-visualization-geomap-embed-0, #google-visualization-geomap-embed-1, #google-visualization-geomap-embed-2 {
}


/* ============================================================================== */
/*  Datatable                                                                     */
/* ============================================================================== */

table.dataTable tr.odd td.sorting_1, table.dataTable tr.even td.sorting_1 {
  background: none !important;
}
.sorting_asc  { background: url('/theme/eldy/img/sort_asc.png') no-repeat center right !important; }
.sorting_desc { background: url('/theme/eldy/img/sort_desc.png') no-repeat center right !important; }
.sorting_asc_disabled  { background: url('/theme/eldy/img/sort_asc_disabled.png') no-repeat center right !important; }
.sorting_desc_disabled { background: url('/theme/eldy/img/sort_desc_disabled.png') no-repeat center right !important; }
.dataTables_paginate {
	margin-top: 8px;
}
.paginate_button_disabled {
  opacity: 1 !important;
  color: #888 !important;
  cursor: default !important;
}
.paginate_disabled_previous:hover, .paginate_enabled_previous:hover, .paginate_disabled_next:hover, .paginate_enabled_next:hover
{
	font-weight: normal;
}
.paginate_enabled_previous:hover, .paginate_enabled_next:hover
{
	text-decoration: underline !important;
}
.paginate_active
{
	text-decoration: underline !important;
}
.paginate_button
{
	font-weight: normal !important;
    text-decoration: none !important;
}
.paging_full_numbers {
	height: inherit !important;
}
.paging_full_numbers a.paginate_active:hover, .paging_full_numbers a.paginate_button:hover {
	background-color: #DDD !important;
}
.paging_full_numbers, .paging_full_numbers a.paginate_active, .paging_full_numbers a.paginate_button {
	background-color: #FFF !important;
	border-radius: inherit !important;
}
.paging_full_numbers a.paginate_button_disabled:hover, .paging_full_numbers a.disabled:hover {
    background-color: #FFF !important;
}
.paginate_button, .paginate_active {
  border: 1px solid #ddd !important;
  padding: 6px 12px !important;
  margin-left: -1px !important;
  line-height: 1.42857143 !important;
  margin: 0 0 !important;
}

/* For jquery plugin combobox */
/* Disable this. It breaks wrapping of boxes
.ui-corner-all { white-space: nowrap; } */

.ui-state-disabled, .ui-widget-content .ui-state-disabled, .ui-widget-header .ui-state-disabled, .paginate_button_disabled {
	opacity: .35;
	background-image: none;
}

div.dataTables_length {
	float: right !important;
	padding-left: 8px;
}
div.dataTables_length select {
	background: #fff;
}
.dataTables_wrapper .dataTables_paginate {
	padding-top: 0px !important;
}

/* ============================================================================== */
/*  Select2                                                                       */
/* ============================================================================== */

.select2-container--default .select2-results__option--highlighted[aria-selected] {
    background-color: rgb(55,61,90);
    color: #FFFFFF;
}

.select2-container--focus span.select2-selection.select2-selection--single {
    border-bottom: 1px solid #666 !important;
}

.blockvmenusearch .select2-container--default .select2-selection--single,
.blockvmenubookmarks .select2-container--default .select2-selection--single
{
    background-color: unset;
}
.select2-container--default .select2-selection--single .select2-selection__rendered {
    color: unset;
}
.select2-default {
    color: #999 !important;
}
.select2-choice, .select2-container .select2-choice {
	border-bottom: solid 1px rgba(0,0,0,.4);
}
.select2-container .select2-choice > .select2-chosen {
    margin-right: 23px;
}
.select2-container .select2-choice .select2-arrow {
	border-radius: 0;
    background: transparent;
}
.select2-container-multi .select2-choices {
	background-image: none;
}
.select2-container .select2-choice {
	color: #000;
	border-radius: 0;
}
.selectoptiondisabledwhite {
	background: #FFFFFF !important;
}
.select2-arrow {
	border: none;
	border-left: none !important;
	background: none !important;
}
.select2-choice
{
	border-top: none !important;
	border-left: none !important;
	border-right: none !important;
}
.select2-drop.select2-drop-above {
	box-shadow: none !important;
}
.select2-container--open .select2-dropdown--above {
    border-bottom: solid 1px rgba(0,0,0,.2);
}
.select2-drop.select2-drop-above.select2-drop-active {
	border-top: 1px solid #ccc;
	border-bottom: solid 1px rgba(0,0,0,.2);
}
.select2-container--default .select2-selection--single
{
	outline: none;
	border-top: none;
	border-left: none;
	border-right: none;
	border-bottom: solid 1px rgba(0,0,0,.2);
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
	border-radius: 0 !important;
}
.select2-container--default .select2-selection--multiple {
	border: solid 1px rgba(0,0,0,.2);
	border-radius: 0 !important;
}
.select2-search__field
{
	outline: none;
	border-top: none !important;
	border-left: none !important;
	border-right: none !important;
	border-bottom: solid 1px rgba(0,0,0,.2) !important;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
	border-radius: 0 !important;
}
.select2-container-active .select2-choice, .select2-container-active .select2-choices
{
	outline: none;
	border-top: none;
	border-left: none;
	border-bottom: none;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}
.select2-dropdown {
	border: 1px solid #ccc;
	box-shadow: 1px 2px 10px #ddd;
}
.select2-dropdown-open {
	background-color: #fff;
}
.select2-dropdown-open .select2-choice, .select2-dropdown-open .select2-choices
{
	outline: none;
	border-top: none;
	border-left: none;
	border-bottom: none;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
	background-color: #fff;
}
.select2-disabled
{
	color: #888;
}
.select2-drop.select2-drop-above.select2-drop-active, .select2-drop {
	border-radius: 0;
}
.select2-drop.select2-drop-above {
	border-radius:  0;
}
.select2-dropdown-open.select2-drop-above .select2-choice, .select2-dropdown-open.select2-drop-above .select2-choices {
	background-image: none;
	border-radius: 0 !important;
}
div.select2-drop-above
{
	background: #fff;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}
.select2-drop-active
{
	border: 1px solid #ccc;
	padding-top: 4px;
}
.select2-search input {
	border: none;
}
a span.select2-chosen
{
	font-weight: normal !important;
}
.select2-container .select2-choice {
	background-image: none;
	/* line-height: 24px; */
}
.select2-results .select2-no-results, .select2-results .select2-searching, .select2-results .select2-ajax-error, .select2-results .select2-selection-limit
{
	background: #FFFFFF;
}
.select2-results {
	max-height:	400px;
}
.select2-container.select2-container-disabled .select2-choice, .select2-container-multi.select2-container-disabled .select2-choices {
	background-color: #FFFFFF;
	background-image: none;
	border: none;
	cursor: default;
}
.select2-container-disabled .select2-choice .select2-arrow b {
	opacity: 0.4;
}
.select2-container-multi .select2-choices .select2-search-choice {
  margin-bottom: 3px;
}
.select2-dropdown-open.select2-drop-above .select2-choice, .select2-dropdown-open.select2-drop-above .select2-choices, .select2-container-multi .select2-choices,
.select2-container-multi.select2-container-active .select2-choices
{
	border-bottom: 1px solid #ccc;
	border-right: none;
	border-top: none;
	border-left: none;

}
.select2-container--default .select2-results>.select2-results__options{
    max-height: 400px;
}

/* Special case for the select2 add widget */
#addbox .select2-container .select2-choice > .select2-chosen, #actionbookmark .select2-container .select2-choice > .select2-chosen {
    text-align: left;
    opacity: 0.4;
}
.select2-container--default .select2-selection--single .select2-selection__placeholder {
	color: unset;
	opacity: 0.4;
}
span#select2-boxbookmark-container, span#select2-boxcombo-container {
    text-align: left;
    opacity: 0.4;
}
.select2-container .select2-selection--single .select2-selection__rendered {
	padding-left: 6px;
}
/* Style used before the select2 js is executed on boxcombo */
#boxbookmark.boxcombo, #boxcombo.boxcombo {
    text-align: left;
    opacity: 0.4;
    border-bottom: solid 1px rgba(0,0,0,.4) !important;
    height: 26px;
    line-height: 24px;
    padding: 0 0 2px 0;
    vertical-align: top;
}

/* To emulate select 2 style */
.select2-container-multi-dolibarr .select2-choices-dolibarr .select2-search-choice-dolibarr {
  padding: 2px 5px 1px 5px;
  margin: 0 0 2px 3px;
  position: relative;
  line-height: 13px;
  color: #333;
  cursor: default;
  border: 1px solid #aaaaaa;
  border-radius: 3px;
  -webkit-box-shadow: 0 0 2px #fff inset, 0 1px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 2px #fff inset, 0 1px 0 rgba(0, 0, 0, 0.05);
  background-clip: padding-box;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: #e4e4e4;
  background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(20%, #f4f4f4), color-stop(50%, #f0f0f0), color-stop(52%, #e8e8e8), color-stop(100%, #eee));
  background-image: -webkit-linear-gradient(top, #f4f4f4 20%, #f0f0f0 50%, #e8e8e8 52%, #eee 100%);
  background-image: -moz-linear-gradient(top, #f4f4f4 20%, #f0f0f0 50%, #e8e8e8 52%, #eee 100%);
  background-image: linear-gradient(to bottom, #f4f4f4 20%, #f0f0f0 50%, #e8e8e8 52%, #eee 100%);
}
.select2-container-multi-dolibarr .select2-choices-dolibarr .select2-search-choice-dolibarr a {
	font-weight: normal;
}
.select2-container-multi-dolibarr .select2-choices-dolibarr li {
  float: left;
  list-style: none;
}
.select2-container-multi-dolibarr .select2-choices-dolibarr {
  height: auto !important;
  height: 1%;
  margin: 0;
  padding: 0 5px 0 0;
  position: relative;
  cursor: text;
  overflow: hidden;
}


/* ============================================================================== */
/*  For categories                                                                */
/* ============================================================================== */

.noborderoncategories {
	border: none !important;
	border-radius: 5px !important;
	box-shadow: none;
	-webkit-box-shadow: none !important;
    box-shadow: none !important;
}
span.noborderoncategories a, li.noborderoncategories a {
	line-height: normal;
	vertical-align: top;
}
span.noborderoncategories {
	padding: 3px 5px 0px 5px;
}
.categtextwhite, .treeview .categtextwhite.hover {
	color: #fff !important;
}
.categtextblack {
	color: #000 !important;
}


/* ============================================================================== */
/*  External lib multiselect with checkbox                                        */
/* ============================================================================== */

.multi-select-container {
  display: inline-block;
  position: relative;
}

.multi-select-menu {
  position: absolute;
  left: 0;
  top: 0.8em;
  float: left;
  min-width: 100%;
  background: #fff;
  margin: 1em 0;
  padding: 0.4em 0;
  border: 1px solid #aaa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: none;
}

.multi-select-menu input {
  margin-right: 0.3em;
  vertical-align: 0.1em;
}

.multi-select-button {
  display: inline-block;
  max-width: 20em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  background-color: #fff;
  cursor: default;

  border: none;
  border-bottom: solid 1px rgba(0,0,0,.2);
  padding: 5px;
  padding-left: 2px;
  height: 17px;
}
.multi-select-button:focus {
  outline: none;
  border-bottom: 1px solid #666;
}

.multi-select-button:after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.5em 0.23em 0em 0.23em;
  border-color: #444 transparent transparent transparent;
  margin-left: 0.4em;
}

.multi-select-container--open .multi-select-menu { display: block; }

.multi-select-container--open .multi-select-button:after {
  border-width: 0 0.4em 0.4em 0.4em;
  border-color: transparent transparent #999 transparent;
}

.multi-select-menuitem {
    clear: both;
    float: left;
    padding-left: 5px
}


/* ============================================================================== */
/*  Native multiselect with checkbox                                              */
/* ============================================================================== */

ul.ulselectedfields {
    z-index: 95;			/* To have the select box appears on first plan even when near buttons are decorated by jmobile */
}
dl.dropdown {
    margin:0px;
	margin-left: 2px;
    margin-right: 2px;
    padding:0px;
    vertical-align: middle;
    display: inline-block;
}
.dropdown dd, .dropdown dt {
    margin:0px;
    padding:0px;
}
.dropdown ul {
    margin: -1px 0 0 0;
    text-align: left;
}
.dropdown dd {
    position:relative;
}
.dropdown dt a {
    display:block;
    overflow: hidden;
    border:0;
}
.dropdown dt a span, .multiSel span {
    cursor:pointer;
    display:inline-block;
    padding: 0 3px 2px 0;
}
.dropdown span.value {
    display:none;
}
.dropdown dd ul {
    background-color: #FFF;
    box-shadow: 1px 1px 10px #aaa;
    display:none;
    right:0px;						/* pop is align on right */
    padding: 0 0 0 0;
    position:absolute;
    top:2px;
    list-style:none;
    max-height: 264px;
    overflow: auto;
    border-radius: 2px;
}
.dropdown dd ul li {
	white-space: nowrap;
	font-weight: normal;
	padding: 7px 8px 7px 8px;
	/* color: rgb(0,0,0); */
	color: #000;
}
.dropdown dd ul li:hover {
	background: #eee;
}
.dropdown dd ul li input[type="checkbox"] {
    margin-right: 3px;
}
.dropdown dd ul li a, .dropdown dd ul li span {
    padding: 3px;
    display: block;
}
.dropdown dd ul li span {
	color: #888;
}
.dropdown dd ul li a:hover {
    background-color:#eee;
}
dd.dropdowndd ul li {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}


/* ============================================================================== */
/*  Markdown rendering                                                             */
/* ============================================================================== */

.imgmd {
	width: 90%;
}
.moduledesclong h1 {
	padding-top: 10px;
	padding-bottom: 20px;
}


/* ============================================================================== */
/*  JMobile - Android                                                             */
/* ============================================================================== */

.searchpage .tagtr .tagtd {
    padding-bottom: 3px;
}
.searchpage .tagtr .tagtd .button {
	background: unset;
    border: unset;
}

li.ui-li-divider .ui-link {
	color: #FFF !important;
}
.ui-btn {
	margin: 0.1em 2px
}
a.ui-link, a.ui-link:hover, .ui-btn:hover, span.ui-btn-text:hover, span.ui-btn-inner:hover {
	text-decoration: none !important;
}
.ui-body-c {
	background: #fff;
}

.ui-btn-inner {
	min-width: .4em;
	padding-left: 6px;
	padding-right: 6px;
	font-size: 0.86em;
	/* white-space: normal; */		/* Warning, enable this break the truncate feature */
}
.ui-btn-icon-right .ui-btn-inner {
	padding-right: 30px;
}
.ui-btn-icon-left .ui-btn-inner {
	padding-left: 30px;
}
.ui-select .ui-btn-icon-right .ui-btn-inner {
	padding-right: 30px;
}
.ui-select .ui-btn-icon-left .ui-btn-inner {
	padding-left: 30px;
}
.ui-select .ui-btn-icon-right .ui-icon {
    right: 8px;
}
.ui-btn-icon-left > .ui-btn-inner > .ui-icon, .ui-btn-icon-right > .ui-btn-inner > .ui-icon {
    margin-top: -10px;
}
select {
    /* display: inline-block; */	/* We can't set this. This disable ability to make */
    overflow:hidden;
    white-space: nowrap;			/* Enabling this make behaviour strange when selecting the empty value if this empty value is '' instead of '&nbsp;' */
    text-overflow: ellipsis;
}
.fiche .ui-controlgroup {
	margin: 0px;
	padding-bottom: 0px;
}
div.ui-controlgroup-controls div.tabsElem
{
	margin-top: 2px;
}
div.ui-controlgroup-controls div.tabsElem a
{
	-webkit-box-shadow: 0 -3px 6px rgba(0,0,0,.2);
	box-shadow: 0 -3px 6px rgba(0,0,0,.2);
}
div.ui-controlgroup-controls div.tabsElem a#active {
	-webkit-box-shadow: 0 -3px 6px rgba(0,0,0,.3);
	box-shadow: 0 -3px 6px rgba(0,0,0,.3);
}

a.tab span.ui-btn-inner
{
	border: none;
	padding: 0;
}

.ui-link {
	color: rgb(0,0,0);
}
.liste_titre .ui-link {
	color: rgb(0,0,0) !important;
}

a.ui-link {
	word-wrap: break-word;
}

/* force wrap possible onto field overflow does not works */
.formdoc .ui-btn-inner
{
	white-space: normal;
	overflow: hidden;
	text-overflow: clip; /* "hidden" : do not exists as a text-overflow value (https://developer.mozilla.org/fr/docs/Web/CSS/text-overflow) */
}

/* Warning: setting this may make screen not beeing refreshed after a combo selection */
/*.ui-body-c {
	background: #fff;
}*/

div.ui-radio, div.ui-checkbox
{
	display: inline-block;
	border-bottom: 0px !important;
}
.ui-checkbox input, .ui-radio input {
	height: auto;
	width: auto;
	margin: 4px;
	position: static;
}
div.ui-checkbox label+input, div.ui-radio label+input {
	position: absolute;
}
.ui-mobile fieldset
{
	padding-bottom: 10px; margin-bottom: 4px; border-bottom: 1px solid #AAAAAA !important;
}

ul.ulmenu {
	border-radius: 0;
	-webkit-border-radius: 0;
}

.ui-field-contain label.ui-input-text {
	vertical-align: middle !important;
}
.ui-mobile fieldset {
	border-bottom: none !important;
}

/* Style for first level menu with jmobile */
.ui-li .ui-btn-inner a.ui-link-inherit, .ui-li-static.ui-li {
    padding: 1em 15px;
    display: block;
}
.ui-btn-up-c {
	font-weight: normal;
}
.ui-focus, .ui-btn:focus {
    -webkit-box-shadow: none;
    box-shadow: none;
}
.ui-bar-b {
    /*border: 1px solid #888;*/
    border: none;
    background: none;
    text-shadow: none;
    color: rgb(0,113,121) !important;
}
.ui-bar-b, .lilevel0 {
    background-repeat: repeat-x;
    border: none;
    background: none;
    text-shadow: none;
    color: rgb(0,113,121) !important;
}
.alilevel0 {
	font-weight: normal !important;
}

.ui-li.ui-last-child, .ui-li.ui-field-contain.ui-last-child {
    border-bottom-width: 0px !important;
}
.alilevel0 {
    color: rgb(0,0,0) !important;
    background: #f8f8f8
}
.ulmenu {
	box-shadow: none !important;
	border-bottom: 1px solid #ccc;
}
.ui-btn-icon-right {
	border-right: 1px solid #ccc !important;
}
.ui-body-c {
	border: 1px solid #ccc;
	text-shadow: none;
}
.ui-btn-up-c, .ui-btn-hover-c {
	/* border: 1px solid #ccc; */
	text-shadow: none;
}
.ui-body-c .ui-link, .ui-body-c .ui-link:visited, .ui-body-c .ui-link:hover {
	color: rgb(10, 20, 100);
}
.ui-btn-up-c .vsmenudisabled {
	color: #888888 !important;
	text-shadow: none !important;
}
div.tabsElem a.tab {
	background: transparent;
}
.alilevel1 {
    color: rgb(0,113,121) !important;
}
.lilevel1 {
    border-top: 2px solid #444;
    background: #fff ! important;
}
.lilevel1 div div a {
	font-weight: bold !important;
}
.lilevel2
{
	padding-left: 22px;
    background: #fff ! important;
}
.lilevel3
{
	padding-left: 44px;
	background: #fff ! important;
}
.lilevel4
{
	padding-left: 66px;
    background: #fff ! important;
}
.lilevel5
{
	padding-left: 88px;
    background: #fff ! important;
}



/* ============================================================================== */
/*  POS                                                                           */
/* ============================================================================== */

.menu_choix1 a {
	background: url('/theme/eldy/img/menus_black/money.png') top left no-repeat;
}
.menu_choix2 a {
	background: url('/theme/eldy/img/menus_black/home.png') top left no-repeat;
}
.menu_choix1,.menu_choix2 {
	font-size: 1.4em;
	text-align: left;
	border: 1px solid #666;
	margin-right: 20px;
}
.menu_choix1 a, .menu_choix2 a {
	display: block;
	color: #fff;
	text-decoration: none;
	padding-top: 18px;
	padding-left: 54px;
	font-size: 14px;
	height: 38px;
}
.menu_choix1 a:hover,.menu_choix2 a:hover {
	color: #6d3f6d;
}
.menu li.menu_choix1 {
    padding-top: 6px;
    padding-right: 10px;
    padding-bottom: 2px;
}
.menu li.menu_choix2 {
    padding-top: 6px;
    padding-right: 10px;
    padding-bottom: 2px;
}
@media only screen and (max-width: 767px)
{
	.menu_choix1 a, .menu_choix2 a {
		background-size: 36px 36px;
		height: 30px;
		padding-left: 40px;
	}
    .menu li.menu_choix1, .menu li.menu_choix2 {
        padding-left: 4px;
        padding-right: 0;
    }
    .liste_articles {
    	margin-right: 0 !important;
    }
}


/* ============================================================================== */
/*  Public                                                                        */
/* ============================================================================== */

/* The theme for public pages */
.public_body {
	margin: 20px;
}
.public_border {
	border: 1px solid #888;
}



/* ============================================================================== */
/* Ticket module                                                                  */
/* ============================================================================== */
.ticketpublicarea {
	width: 70%;
}
.publicnewticketform {
	/* margin-top: 25px !important; */
}
.ticketlargemargin {
	padding-left: 50px;
	padding-right: 50px;
	padding-top: 10px;
}
@media only screen and (max-width: 767px)
{
	.ticketlargemargin {
		padding-left: 5px; padding-right: 5px;
	}
	.ticketpublicarea {
		width: 100% !important;
	}
}

#cd-timeline {
  position: relative;
  padding: 2em 0;
  margin-bottom: 2em;
}
#cd-timeline::before {
  /* this is the vertical line */
  content: '';
  position: absolute;
  top: 0;
  left: 18px;
  height: 100%;
  width: 4px;
  background: #d7e4ed;
}
@media only screen and (min-width: 1170px) {
  #cd-timeline {
    margin-bottom: 3em;
  }
  #cd-timeline::before {
    left: 50%;
    margin-left: -2px;
  }
}

.cd-timeline-block {
  position: relative;
  margin: 2em 0;
}
.cd-timeline-block:after {
  content: "";
  display: table;
  clear: both;
}
.cd-timeline-block:first-child {
  margin-top: 0;
}
.cd-timeline-block:last-child {
  margin-bottom: 0;
}
@media only screen and (min-width: 1170px) {
  .cd-timeline-block {
    margin: 4em 0;
  }
  .cd-timeline-block:first-child {
    margin-top: 0;
  }
  .cd-timeline-block:last-child {
    margin-bottom: 0;
  }
}

.cd-timeline-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px white, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
  background: #d7e4ed;
}
.cd-timeline-img img {
  display: block;
  width: 24px;
  height: 24px;
  position: relative;
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
}
.cd-timeline-img.cd-picture {
  background: #75ce66;
}
.cd-timeline-img.cd-movie {
  background: #c03b44;
}
.cd-timeline-img.cd-location {
  background: #f0ca45;
}
@media only screen and (min-width: 1170px) {
  .cd-timeline-img {
    width: 60px;
    height: 60px;
    left: 50%;
    margin-left: -30px;
    /* Force Hardware Acceleration in WebKit */
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
  }
  .cssanimations .cd-timeline-img.is-hidden {
    visibility: hidden;
  }
  .cssanimations .cd-timeline-img.bounce-in {
    visibility: visible;
    -webkit-animation: cd-bounce-1 0.6s;
    -moz-animation: cd-bounce-1 0.6s;
    animation: cd-bounce-1 0.6s;
  }
}

@-webkit-keyframes cd-bounce-1 {
  0% {
    opacity: 0;
    -webkit-transform: scale(0.5);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale(1.2);
  }

  100% {
    -webkit-transform: scale(1);
  }
}
@-moz-keyframes cd-bounce-1 {
  0% {
    opacity: 0;
    -moz-transform: scale(0.5);
  }

  60% {
    opacity: 1;
    -moz-transform: scale(1.2);
  }

  100% {
    -moz-transform: scale(1);
  }
}
@keyframes cd-bounce-1 {
  0% {
    opacity: 0;
    -webkit-transform: scale(0.5);
    -moz-transform: scale(0.5);
    -ms-transform: scale(0.5);
    -o-transform: scale(0.5);
    transform: scale(0.5);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    transform: scale(1.2);
  }

  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }
}
.cd-timeline-content {
  position: relative;
  margin-left: 60px;
  background: white;
  border-radius: 0.25em;
  padding: 1em;
  background-image: -o-linear-gradient(bottom, rgba(0,0,0,0.1) 0%, rgba(230,230,230,0.4) 100%);
  background-image: -moz-linear-gradient(bottom, rgba(0,0,0,0.1) 0%, rgba(230,230,230,0.4) 100%);
  background-image: -webkit-linear-gradient(bottom, rgba(0,0,0,0.1) 0%, rgba(230,230,230,0.4) 100%);
  background-image: -ms-linear-gradient(bottom, rgba(0,0,0,0.1) 0%, rgba(230,230,230,0.4) 100%);
  background-image: linear-gradient(bottom, rgba(0,0,0,0.1) 0%, rgba(230,230,230,0.4) 100%);
}
.cd-timeline-content:after {
  content: "";
  display: table;
  clear: both;
}
.cd-timeline-content h2 {
  color: #303e49;
}
.cd-timeline-content .cd-date {
  font-size: 13px;
  font-size: 0.8125rem;
}
.cd-timeline-content .cd-date {
  display: inline-block;
}
.cd-timeline-content p {
  margin: 1em 0;
  line-height: 1.6;
}

.cd-timeline-content .cd-date {
  float: left;
  padding: .2em 0;
  opacity: .7;
}
.cd-timeline-content::before {
  content: '';
  position: absolute;
  top: 16px;
  right: 100%;
  height: 0;
  width: 0;
  border: 7px solid transparent;
  border-right: 7px solid white;
}
@media only screen and (min-width: 768px) {
  .cd-timeline-content h2 {
    font-size: 20px;
    font-size: 1.25rem;
  }
  .cd-timeline-content {
    font-size: 16px;
    font-size: 1rem;
  }
  .cd-timeline-content .cd-read-more, .cd-timeline-content .cd-date {
    font-size: 14px;
    font-size: 0.875rem;
  }
}
@media only screen and (min-width: 1170px) {
  .cd-timeline-content {
    margin-left: 0;
    padding: 1.6em;
    width: 43%;
  }
  .cd-timeline-content::before {
    top: 24px;
    left: 100%;
    border-color: transparent;
    border-left-color: white;
  }
  .cd-timeline-content .cd-read-more {
    float: left;
  }
  .cd-timeline-content .cd-date {
    position: absolute;
    width: 55%;
    left: 115%;
    top: 6px;
    font-size: 16px;
    font-size: 1rem;
  }
  .cd-timeline-block:nth-child(even) .cd-timeline-content {
    float: right;
  }
  .cd-timeline-block:nth-child(even) .cd-timeline-content::before {
    top: 24px;
    left: auto;
    right: 100%;
    border-color: transparent;
    border-right-color: white;
  }
  .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-read-more {
    float: right;
  }
  .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-date {
    left: auto;
    right: 115%;
    text-align: right;
  }

}



/* ============================================================================== */
/* CSS style used for small screen                                                */
/* ============================================================================== */

.topmenuimage {
	background-size: 22px auto;
	top: 2px;
}
.imgopensurveywizard
{
	padding: 0 4px 0 4px;
}
@media only screen and (max-width: 767px)
{
	.imgopensurveywizard, .imgautosize { width:95%; height: auto; }

	#tooltip {
		position: absolute;
		width: 350px;
	}

    div.tabBar {
        padding-left: 0px;
        padding-right: 0px;
        -webkit-border-radius: 0;
    	border-radius: 0px;
        border-right: none;
        border-left: none;
    }

	.box-flex-container {
	    margin: 0 0 0 -8px !important;
	}

}

@media only screen and (max-width: 1024px)
{
	div#ecm-layout-west {
		width: calc(100% - 4px);
		clear: both;
	}
	div#ecm-layout-center {
		width: 100%;
	}
}

/* nboftopmenuentries = 13, fontsize=0.86em */
/* rule to reduce top menu - 1st reduction: Reduce width of top menu icons */
@media only screen and (max-width: 1510px)	/* reduction 1 */
{
	div.tmenucenter {
	    width: 52px;	/* size of viewport */
    	white-space: nowrap;
  		overflow: hidden;
  		text-overflow: ellipsis;
  		color: #FFFFFF;
	}
	.mainmenuaspan {
  		font-size: 0.9em;
  		padding-right: 0;
    }
    .topmenuimage {
    	background-size: 22px auto;
    	margin-top: 0px;
	}

    li.tmenu, li.tmenusel {
    	min-width: 36px;
    }
    div.mainmenu {
    	min-width: auto;
    }
	div.tmenuleft {
		display: none;
	}

	.dropdown dd ul {
		max-width: 350px;
	}
}
/* rule to reduce top menu - 2nd reduction: Reduce width of top menu icons again */
@media only screen and (max-width: 1027px)	/* reduction 2 */
{
	li.tmenucompanylogo {
		display: none;
	}
	div.mainmenu {
		height: 23px;
	}
	div.tmenucenter {
	    max-width: 26px;	/* size of viewport */
  		text-overflow: clip;
	}
	span.mainmenuaspan {
    	margin-left: 1px;
	}
	.mainmenuaspan {
  		font-size: 0.9em;
  		padding-left: 0;
  		padding-right: 0;
    }
    .topmenuimage {
    	background-size: 20px auto;
    	margin-top: 2px;
    	left: 4px;
	}

	.dropdown dd ul {
		max-width: 300px;
	}
}
/* rule to reduce top menu - 3rd reduction: The menu for user is on left */
@media only screen and (max-width: 741px)	/* reduction 3 */
{
	.side-nav {
		z-index: 200;
		background: rgb(250,250,250);
		padding-top: 70px;
    }
	#id-left {
    	z-index: 201;
		background: rgb(250,250,250);
	}

    .login_vertical_align {
    	padding-left: 20px;
    	padding-right: 20px;
    }

	/* Reduce login top right info */
	.help {
		}
	div#tmenu_tooltip {
			padding-right: 0;
		}
	div.login_block_user {
		min-width: 0;
		width: 100%;
	}
	div.login_block a {
        color: unset;
    }
	div.login_block {
		/* Style when phone layout or when using the menuhider */
		padding-top: 10px;
		padding-left: 20px;
    	padding-right: 20px;
    	padding-bottom: 16px;
		top: inherit !important;
		left: 0 !important;
		text-align: center;
        vertical-align: middle;

		background: rgb(250,250,250);

        height: 50px;

    	z-index: 202;
    	min-width: 200px;      /* must be width of menu + padding + padding of sidenav */
    	max-width: 200px;      /* must be width of menu + padding + padding of sidenav */
    	width: 200px;          /* must be width of menu + padding + padding of sidenav */
    }
    .side-nav-vert .user-menu .dropdown-menu {
        width: 234px !important;
    }
    div.login_block_other {
        margin-right: unset;
    }
	div.login_block_user, div.login_block_other { clear: both; }
	.atoplogin, .atoplogin:hover
	{
		color: #000 !important;
	}
	.login_block_elem {
		padding: 0 !important;
		height: 38px;
	}
    li.tmenu, li.tmenusel {
        min-width: 32px;
    }
	div.mainmenu {
		height: 23px;
	}
	div.tmenucenter {
  		text-overflow: clip;
	}
    .topmenuimage {
    	background-size: 20px auto;
    	margin-top: 2px !important;
    	left: 2px;
	}
	div.mainmenu {
    	min-width: 20px;
    }

	.titlefield {
	    width: auto !important;		/* We want to ignore the 30%, try to use more if you can */
	}
	.tableforfield>tr>td:first-child, .tableforfield>tbody>tr>td:first-child, div.tableforfield div.tagtr>div.tagtd:first-of-type {
	    /* max-width: 100px; */			/* but no more than 100px */
	}
	.tableforfield>tr>td:nth-child(2), .tableforfield>tbody>tr>td:nth-child(2), div.tableforfield div.tagtr>div.tagtd:nth-child(2) {
	    word-break: break-word;
	}
	.badge {
		line-height: 1.2em;
		min-width: auto;
		font-size: 12px;
	}

	table.table-fiche-title .col-title div.titre{
		line-height: unset;
	}

	input#addedfile {
		width: 95%;
	}
}

/* <style type="text/css" > dont remove this line it's an ide hack */
/*
 * Dropdown of user popup
 */

button.dropdown-item.global-search-item {
    outline: none;
}

.open>.dropdown-search, .open>.dropdown-bookmark, .open>.dropdown-menu{
    display: block;
}

.dropdown-search {
    border-color: #eee;

    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}
.dropdown-bookmark {
    border-color: #eee;

    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}
.dropdown-menu {
    border-color: #eee;

    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}


.dropdown-toggle{
    text-decoration: none !important;
}

.dropdown-toggle::after {
    /* font part */
    font-family: "Font Awesome 5 Free";
    font-size: 0.7em;
    font-weight: 900;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    text-align:center;
    text-decoration:none;
    margin:  auto 3px;
    display: inline-block;
    content: "\f078";

    -webkit-transition: -webkit-transform .2s ease-in-out;
    -ms-transition: -ms-transform .2s ease-in-out;
    transition: transform .2s ease-in-out;
}

.open>.dropdown-toggle::after {
    transform: rotate(180deg);
}

/*
* MENU Dropdown
*/
.login_block.usedropdown .logout-btn{
    display: none;
}

.tmenu .open.dropdown, .tmenu .open.dropdown {
    background: rgba(0, 0, 0, 0.1);
}
.tmenu .dropdown-menu, .login_block .dropdown-menu {
    position: absolute;
    right: 0;
    left: auto;
    line-height:1.3em;
}
.tmenu .dropdown-menu, .login_block  .dropdown-menu .user-body {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
.user-body {
    color: #333;
}
.side-nav-vert .user-menu .dropdown-menu {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    padding: 1px 0 0 0;
    border-top-width: 0;
    width: 300px;
}
.side-nav-vert .user-menu .dropdown-menu {
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.side-nav-vert .user-menu .dropdown-menu > .user-header {
    min-height: 100px;
    padding: 10px;
    text-align: center;
    white-space: normal;
}

#topmenu-global-search-dropdown .dropdown-menu{
    width: 300px;
    max-width: 100%;
}

div#topmenu-global-search-dropdown, div#topmenu-bookmark-dropdown {
    line-height: 46px;
}
a.top-menu-dropdown-link {
    padding: 8px;
}

.dropdown-user-image {
    border-radius: 50%;
    vertical-align: middle;
    z-index: 5;
    height: 90px;
    width: 90px;
    border: 3px solid;
    border-color: transparent;
    border-color: rgba(255, 255, 255, 0.2);
    max-width: 100%;
    max-height :100%;
}

.dropdown-menu > .user-header{
    background: rgb(55,61,90);
}



.dropdown-menu .dropdown-header{
    padding: 5px 10px 10px 10px;
}

.dropdown-menu > .user-footer {
    background-color: #f9f9f9;
    padding: 10px;
}

.user-footer:after {
    clear: both;
}


.dropdown-menu > .bookmark-footer{
    padding: 10px;
}


.dropdown-menu > .user-body, .dropdown-body{
    padding: 15px;
    border-bottom: 1px solid #f4f4f4;
    border-top: 1px solid #dddddd;
    white-space: normal;
}

.dropdown-menu > .bookmark-body, .dropdown-body{
    padding: 10px 0;
    overflow-y: auto;
    max-height: 60vh ; /* fallback for browsers without support for calc() */
    max-height: calc(90vh - 110px) ;
	white-space: normal;
}

.dropdown-body::-webkit-scrollbar {
        width: 8px;
    }
.dropdown-body::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0;
    border-radius: 0;
    /* background: rgb(55,61,90); */
    background: #aaa;
}
.dropdown-body::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-border-radius: 0;
    border-radius: 0;
}


#topmenu-login-dropdown, #topmenu-bookmark-dropdown, #topmenu-global-search-dropdown {
    padding: 0 5px 0 5px;
}
#topmenu-login-dropdown a:hover{
    text-decoration: none;
}

#topmenuloginmoreinfo-btn{
    display: block;
    text-aling: right;
    color:#666;
    cursor: pointer;
}

#topmenuloginmoreinfo{
    display: none;
    clear: both;
    font-size: 0.95em;
}

.button-top-menu-dropdown {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

.user-footer .button-top-menu-dropdown {
    color: #666666;
    border-radius: 0;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-width: 1px;
    background-color: #f4f4f4;
    border-color: #ddd;
}

.dropdown-menu a.top-menu-dropdown-link {
    color: rgb(10, 20, 100) !important;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    display: block;
    margin: 5px 0px;
}

.dropdown-item {
    display: block !important;
    box-sizing: border-box;
    width: 100%;
    padding: .25rem 1.5rem .25rem 1rem;
    clear: both;
    font-weight: 400;
    color: #212529  !important;
    text-align: inherit;
    background-color: transparent;
    border: 0;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
}

.dropdown-item::before {
    /* font part */
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    text-align:center;
    text-decoration:none;
    margin-right: 5px;
    display: inline-block;
    content: "\f0da";
    color: rgba(0,0,0,0.3);
}


.dropdown-item.active, .dropdown-item:hover, .dropdown-item:focus  {
    color: #FFFFFF !important;
    text-decoration: none;
    background: rgb(55,61,90);
}

/*
* SEARCH
*/

.dropdown-search-input {
    width: 100%;
    padding: 10px 35px 10px 20px;

    background-color: transparent;
    font-size: 14px;
    line-height: 16px;
    box-sizing: border-box;


    color: #575756;
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: 16px 16px;
    background-position: 95% center;
    border-radius: 50px;
    border: 1px solid #c4c4c2 !important;
    transition: all 250ms ease-in-out;
    backface-visibility: hidden;
    transform-style: preserve-3d;

}

.dropdown-search-input::placeholder {
    color: color(#575756 a(0.8));
    letter-spacing: 1.5px;
}

.hidden-search-result{
    display: none !important;
}
/* <style type="text/css" > */

/*
 * Component: Info Box
 * -------------------
 */
.info-box {
	display: block;
    position: relative;
	min-height: 90px;
	background: #fff;
	width: 100%;
	box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	margin-bottom: 15px;
}
.info-box.info-box-sm{
    min-height: 80px;
    margin-bottom: 10px;
}

.info-box small {
	font-size: 14px;
}
.info-box .progress {
	background: rgba(0, 0, 0, 0.2);
	margin: 5px -10px 5px -10px;
	height: 2px;
}
.info-box .progress,
.info-box .progress .progress-bar {
	border-radius: 0;
}

.info-box .progress .progress-bar {
		float: left;
		width: 0;
		height: 100%;
		font-size: 12px;
		line-height: 20px;
		color: #fff;
		text-align: center;
		background-color: #337ab7;
		-webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
		box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
		-webkit-transition: width .6s ease;
		-o-transition: width .6s ease;
		transition: width .6s ease;
}
.info-box-icon {
	border-top-left-radius: 2px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 2px;
	display: block;
    overflow: hidden;
	float: left;
	height: 90px;
	width: 90px;
	text-align: center;
	font-size: 45px;
	line-height: 90px;
	background: rgba(0, 0, 0, 0.2);
}
.info-box-sm .info-box-icon{
    height: 80px;
    width: 80px;
    font-size: 25px;
    line-height: 80px;
}
.info-box-icon > img {
	max-width: 100%;
}
.info-box-icon-text{
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 90px;
    bottom: 0px;
    color: #ffffff;
    background-color: rgba(0,0,0,0.1);
    cursor: default;

    font-size: 10px;
    line-height: 15px;
    padding: 0px 3px;
    text-align: center;
    opacity: 0;
    -webkit-transition: opacity 0.5s, visibility 0s 0.5s;
    transition: opacity 0.5s, visibility 0s 0.5s;
}


.info-box-sm .info-box-icon-text{
    overflow: hidden;
    width: 80px;
}
.info-box:hover .info-box-icon-text{
    opacity: 1;
}

.info-box-content {
	padding: 5px 10px;
	margin-left: 90px;
}

.info-box-sm .info-box-content{
    margin-left: 80px;
}
.info-box-number {
	display: block;
	font-weight: bold;
	font-size: 18px;
}
.progress-description,
.info-box-text,
.info-box-title{
	display: block;
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.info-box-title{
	text-transform: uppercase;
	font-weight: bold;
}
.info-box-text{
	font-size: 0.92em;
}
.info-box-text:first-letter{text-transform: uppercase}
a.info-box-text{ text-decoration: none;}


.info-box-more {
	display: block;
}
.progress-description {
	margin: 0;
}



/* ICONS INFO BOX */
.info-box-icon {
		background-color: #eee !important;
	    opacity: 0.95;
}

.bg-infoxbox-project{
	color: #6c6a98 !important;
}
.bg-infoxbox-action{
	color: #b46080  !important;
}
.bg-infoxbox-propal,
.bg-infoxbox-facture,
.bg-infoxbox-commande{
	color: #99a17d  !important;
}
.bg-infoxbox-supplier_proposal,
.bg-infoxbox-invoice_supplier,
.bg-infoxbox-order_supplier{
	color: #599caf  !important;
}
.bg-infoxbox-contrat{
	color: #469686  !important;
}
.bg-infoxbox-bank_account{
	color: #c5903e  !important;
}
.bg-infoxbox-adherent{
	color: #79633f  !important;
}
.bg-infoxbox-expensereport{
	color: #79633f  !important;
}
.bg-infoxbox-holiday{
	color: #755114  !important;
}


.fa-dol-action:before {
	content: "\f073";
}
.fa-dol-propal:before,
.fa-dol-supplier_proposal:before {
	content: "\f2b5";
}
.fa-dol-facture:before,
.fa-dol-invoice_supplier:before {
	content: "\f571";
}
.fa-dol-project:before {
	content: "\f0e8";
}
.fa-dol-commande:before,
.fa-dol-order_supplier:before {
	content: "\f570";
}
.fa-dol-contrat:before {
	content: "\f1e6";
}
.fa-dol-bank_account:before {
	content: "\f19c";
}
.fa-dol-adherent:before {
	content: "\f0c0";
}
.fa-dol-expensereport:before {
	content: "\f555";
}
.fa-dol-holiday:before {
	content: "\f5ca";
}


/* USING FONTAWESOME FOR WEATHER */
.info-box-weather .info-box-icon{
	background: rgba(0, 0, 0, 0.08) !important;
}
.fa-weather-level0:before{
	content: "\f185";
	color : #cccccc;
}
.fa-weather-level1:before{
	content: "\f6c4";
	color : #cccccc;
}
.fa-weather-level2:before{
	content: "\f0c2";
	color : #cccccc;
}
.fa-weather-level3:before{
	content: "\f740";
	color : #cccccc;
}
.fa-weather-level4:before{
	content: "\f0e7";
	color : #b91f1f;
}

/* USING IMAGES FOR WEATHER INTEAD OF FONT AWESOME */
/* For other themes just uncomment this part */
/*.info-box-weather-level0,
.info-box-weather-level1,
.info-box-weather-level2,
.info-box-weather-level3,
.info-box-weather-level4 {
	background-position: 15px 50%;
	background-repeat: no-repeat;
}

.info-box-weather .info-box-icon{
	display: none !important;
}
.info-box-weather-level0 {
	background-image: url("img/weather/weather-clear.png");
}
.info-box-weather-level1 {
	background-image: url("img/weather/weather-few-clouds.png");
}
.info-box-weather-level2 {
	background-image: url("img/weather/weather-clouds.png");
}
.info-box-weather-level3 {
	background-image: url("img/weather/weather-many-clouds.png");
}
.info-box-weather-level4 {
	background-image: url("img/weather/weather-storm.png");
}*/



.box-flex-container{
	display: flex; /* or inline-flex */
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	margin: 0 0 0 -15px;
	/*justify-content: space-between;*/
}

.box-flex-item{
	flex-grow : 1;
	flex-shrink: 1;
	flex-basis: auto;

	width: 280px;
	margin: 5px 0px 0px 15px;
}
.box-flex-item.filler{
	margin: 0px 0px 0px 15px !important;
	height: 0;
}

/* Disabled. This break the responsive on smartphone
.box{
	overflow: visible;
}
*/
/* <style type="text/css" > */
/*
 progress style is based on boostrap and admin lte framework
 */


/*
 * Component: Progress Bar
 * -----------------------
 */

.progress * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.progress {
    height: 20px;
    overflow: hidden;
    background-color: #f5f5f5;
    background-color: rgba(128, 128, 128, 0.1);
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress.spaced{
    margin-bottom: 20px;
}

.progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
}



.progress-group > .progress{
    clear: both;
}

.progress,
.progress > .progress-bar {
    -webkit-box-shadow: none;
    box-shadow: none;
}
.progress,
.progress > .progress-bar,
.progress .progress-bar,
.progress > .progress-bar .progress-bar {
    border-radius: 1px;
}
/* size variation */
.progress.sm,
.progress-sm {
    height: 10px;
}
.progress.sm,
.progress-sm,
.progress.sm .progress-bar,
.progress-sm .progress-bar {
    border-radius: 1px;
}
.progress.xs,
.progress-xs {
    height: 7px;
}
.progress.xs,
.progress-xs,
.progress.xs .progress-bar,
.progress-xs .progress-bar {
    border-radius: 1px;
}
.progress.xxs,
.progress-xxs {
    height: 3px;
}
.progress.xxs,
.progress-xxs,
.progress.xxs .progress-bar,
.progress-xxs .progress-bar {
    border-radius: 1px;
}


/* Vertical bars */
.progress.vertical {
    position: relative;
    width: 30px;
    height: 200px;
    display: inline-block;
    margin-right: 10px;
}
.progress.vertical > .progress-bar {
    width: 100%;
    position: absolute;
    bottom: 0;
}
.progress.vertical.sm,
.progress.vertical.progress-sm {
    width: 20px;
}
.progress.vertical.xs,
.progress.vertical.progress-xs {
    width: 10px;
}
.progress.vertical.xxs,
.progress.vertical.progress-xxs {
    width: 3px;
}
.progress-group .progress-text {
    font-weight: 600;
}
.progress-group .progress-number {
    float: right;
}



/* Remove margins from progress bars when put in a table */
.table tr > td .progress {
    margin: 0;
}
.progress-bar-light-blue,
.progress-bar-primary {
    background-color: #3c8dbc;
}
.progress-striped .progress-bar-light-blue,
.progress-striped .progress-bar-primary {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-green,
.progress-bar-success {
    background-color: #55a580;
}
.progress-striped .progress-bar-green,
.progress-striped .progress-bar-success {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-aqua,
.progress-bar-info {
    background-color: #00c0ef;
}
.progress-striped .progress-bar-aqua,
.progress-striped .progress-bar-info {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-yellow,
.progress-bar-warning {
    background-color: #a37c0d;
}
.progress-striped .progress-bar-yellow,
.progress-striped .progress-bar-warning {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-red,
.progress-bar-danger {
    background-color: #9f4705;
}
.progress-striped .progress-bar-red,
.progress-striped .progress-bar-danger {
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-consumed {
	background-color: rgb(0, 0, 0, 0.15);
}/* <style type="text/css" > */


/*
* Component: Timeline
* -------------------
*/
.timeline {
    position: relative;
    margin: 0 0 30px 0;
    padding: 0;
    list-style: none;
}
.timeline:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #ddd;
    left: 31px;
    margin: 0;
    border-radius: 2px;
}
.timeline > li {
    position: relative;
    margin-right: 0;
    margin-bottom: 15px;
}
.timeline > li:before,
.timeline > li:after {
    content: " ";
    display: table;
}
.timeline > li:after {
    clear: both;
}
.timeline > li > .timeline-item {
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-shadow:  0 1px 3px rgba(0, 0, 0, 0.1);
    border:1px solid #d2d2d2;
    border-radius: 3px;
    margin-top: 0;
    background: #fff;
    color: #444;
    margin-left: 60px;
    margin-right: 0px;
    padding: 0;
    position: relative;
}

.timeline > li.timeline-code-ticket_msg_private  > .timeline-item {
		background: #fffbe5;
        border-color: #d0cfc0;
}


.timeline > li > .timeline-item > .time{
    color: #6f6f6f;
    float: right;
    padding: 10px;
    font-size: 12px;
}


.timeline > li > .timeline-item > .timeline-header-action{
    color: #6f6f6f;
    float: right;
    padding: 7px;
    font-size: 12px;
}


a.timeline-btn:link,
a.timeline-btn:visited,
a.timeline-btn:hover,
a.timeline-btn:active
{
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    border-radius: 0;
    box-shadow: none;
    padding: 1px 5px;
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    user-select: none;
    background-image: none;
    text-decoration: none;
    background-color: #f4f4f4;
    color: #444;
    border: 1px solid #ddd;
}

a.timeline-btn:hover
{
    background-color: #e7e7e7;
    color: #333;
    border-color: #adadad;;
}


.timeline > li > .timeline-item > .timeline-header {
    margin: 0;
    color: #333;
    border-bottom: 1px solid #f4f4f4;
    padding: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.1;
}

.timeline > li > .timeline-item > .timeline-footer {
	border-top: 1px solid #f4f4f4;
}

.timeline > li.timeline-code-ticket_msg_private  > .timeline-item > .timeline-header, .timeline > li.timeline-code-ticket_msg_private  > .timeline-item > .timeline-footer {
    border-color: #ecebda;
}

.timeline > li > .timeline-item > .timeline-header > a {
    font-weight: 600;
}
.timeline > li > .timeline-item > .timeline-body,
.timeline > li > .timeline-item > .timeline-footer {
    padding: 10px;
}
.timeline > li > .fa,
.timeline > li > .glyphicon,
.timeline > li > .ion {
    width: 30px;
    height: 30px;
    font-size: 15px;
    line-height: 30px;
    position: absolute;
    color: #666;
    background: #d2d6de;
    border-radius: 50%;
    text-align: center;
    left: 18px;
    top: 0;
}
.timeline > .time-label > span {
    font-weight: 600;
    padding: 5px;
    display: inline-block;
    background-color: #fff;
    border-radius: 4px;
}
.timeline-inverse > li > .timeline-item {
    background: #f0f0f0;
    border: 1px solid #ddd;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.timeline-inverse > li > .timeline-item > .timeline-header {
    border-bottom-color: #ddd;
}

.timeline-icon-todo,
.timeline-icon-in-progress,
.timeline-icon-done{
    color: #fff !important;
}

.timeline-icon-not-applicble{
    color: #000;
    background-color: #f7f7f7;
}

.timeline-icon-todo{
    background-color: #dd4b39 !important;
}

.timeline-icon-in-progress{
    background-color: #00c0ef !important;
}
.timeline-icon-done{
    background-color: #00a65a !important;
}


.timeline-badge-date{
    background-color: #0073b7 !important;
    color: #fff !important;
}

.timeline-documents-container{

}

.timeline-documents{
	margin-right: 5px;
}

