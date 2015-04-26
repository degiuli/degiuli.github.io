// Created by iWeb 2.0.4 local-build-20130324

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({stroke_0:new IWStrokeParts([{rect:new IWRect(-2,2,4,106),url:'About_Me_files/stroke.png'},{rect:new IWRect(-2,-2,4,4),url:'About_Me_files/stroke_1.png'},{rect:new IWRect(2,-2,106,4),url:'About_Me_files/stroke_2.png'},{rect:new IWRect(108,-2,4,4),url:'About_Me_files/stroke_3.png'},{rect:new IWRect(108,2,4,106),url:'About_Me_files/stroke_4.png'},{rect:new IWRect(108,108,4,4),url:'About_Me_files/stroke_5.png'},{rect:new IWRect(2,108,106,4),url:'About_Me_files/stroke_6.png'},{rect:new IWRect(-2,108,4,4),url:'About_Me_files/stroke_7.png'}],new IWSize(110,110))});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('About_Me_files/About_MeMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');adjustLineHeightIfTooBig('id4');adjustFontSizeIfTooBig('id4');adjustLineHeightIfTooBig('id5');adjustFontSizeIfTooBig('id5');Widget.onload();fixupAllIEPNGBGs();fixAllIEPNGs('Media/transparent.gif');applyEffects()}
function onPageUnload()
{Widget.onunload();}
