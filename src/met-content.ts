import type { Artwork, Mission, RoleId, Role, Theme } from './content';

export const metArtworkIds = ['met-dawn','met-sunset','met-paris','met-sea','met-gouache','met-clouds','met-sketch'] as const;
export type MetArtworkId = typeof metArtworkIds[number];
export const metExhibition = {
 title: 'Chasing Clouds',
 source: 'https://www.metmuseum.org/exhibitions/chasing-clouds',
 objects: 'https://www.metmuseum.org/exhibitions/chasing-clouds/exhibition-objects',
 dates: 'September 14, 2026–February 28, 2027',
 checked: 'November 27, 2026',
 location: 'The Met Fifth Avenue · Gallery 852',
 note: 'A virtual companion to Chasing Clouds. All seven works are listed in the exhibition. Four individual collection records say “Not on view”; their physical availability is unconfirmed. Check the museum before visiting. This game is not a gallery walking route.',
};
const listed = 'Listed in Chasing Clouds; collection record says Not on view. Physical availability unconfirmed.';
const displayed = 'Collection record lists Gallery 852; included in Chasing Clouds.';
const art = (object: number, fields: Omit<Artwork,'source'|'museum'|'checked'>): Artwork => ({...fields,source:`https://www.metmuseum.org/art/collection/search/${object}`,museum:'The Met',checked:metExhibition.checked});
export const metArtworks: Record<MetArtworkId,Artwork> = {
 'met-dawn': art(370637,{title:'Landscape with rising sun, December 1, 1828, 8:30 a.m.',artist:'Joseph Michael Gandy',date:'1828',medium:'Watercolor over graphite',status:listed,credit:'Harry G. Sperling Fund, 2005 · 2006.46',theme:'people',alt:'Pale rays spread through blue-gray clouds above a low landscape, with handwritten notes at upper right.',detail:'Gandy recorded the date, time and southwest wind on this sheet. The Met interprets the scene as sunrise: in England in December, sunset would occur well before 8:30 p.m. The drawing once belonged to an album owned by the sculptor Sir Richard Westmacott.'}),
 'met-sunset': art(342992,{title:'Sunset',artist:'Eugène Delacroix',date:'ca. 1850',medium:'Pastel on blue laid paper',status:displayed,credit:'Gift from the Karen B. Cohen Collection of Eugène Delacroix, in honor of Philippe de Montebello, 2014 · 2014.732.4',theme:'form',alt:'Blue-gray clouds cross yellow and orange light above a dark strip of land.',detail:'Around 1849–50, Delacroix explored cloud light using pastel. The Met identifies his sky studies as his largest cohesive group in that medium. Its account connects this drawing with his journal observations about contrasts between blue-gray clouds and yellow or orange sky.'}),
 'met-paris': art(265131,{title:'[Cloud Study, Paris]',artist:'Charles Marville',date:'1856–1857',medium:'Albumen silver print from glass negative',status:displayed,credit:'Purchase, The Horace W. Goldsmith Foundation Gift, through Joyce and Robert Menschel, 1987 · 1987.1094',theme:'people',alt:'Dark clouds and pale sky above Paris rooftops, with a prominent dome near the center.',detail:'The Met dates this photograph by Charles Marville to 1856–1857 and identifies its process as an albumen silver print from a glass negative. Its catalogued title places the cloud study in Paris. This is object 1987.1094, distinct from the other Marville cloud study in the exhibition.'}),
 'met-sea': art(283124,{title:'Mediterranean Sea - Sète',artist:'Gustave Le Gray',date:'1857',medium:'Albumen silver print from two glass negatives',status:displayed,credit:'Gilman Collection, Purchase, Robert Rosenkranz Gift, 2005 · 2005.100.48',theme:'form',alt:'A bright sea beneath dramatic clouds; a low horizon divides water from sky, and a dark shore enters from the right.',detail:'Le Gray combined two negatives in this print, one exposed for the sea and another for the sky. The Met explains that early photographic emulsions made exposing both together difficult. It identifies the horizon as the meeting point of the two negatives.'}),
 'met-gouache': art(15505,{title:'Cloud Study (recto, from sketchbook)',artist:'Jervis McEntee',date:'1869',medium:'White gouache on blue paper',status:listed,credit:'Morris K. Jesup Fund, 1982 · 1982.217.4b',theme:'form',alt:'Faint white cloud shapes on a blue sketchbook page, with its binding visible at the left.',detail:'The Met identifies this 1869 sketchbook study by Jervis McEntee as white gouache on blue paper. “Recto” identifies the front of the leaf. The catalogued material distinguishes it from watercolor and from the photographic prints in this chapter.'}),
 'met-clouds': art(12062,{title:'Clouds',artist:'John Singer Sargent',date:'1897',medium:'Watercolor on white wove paper',status:listed,credit:'Gift of Mrs. Francis Ormond, 1950 · 50.130.30',theme:'people',alt:'A tall watercolor of pale and gray clouds against blue sky above a narrow band of land and water.',detail:'John Singer Sargent made this watercolor in 1897. The Met records its support as white wove paper and its dimensions as 14 by 9 15/16 inches. It entered the collection as a gift from Mrs. Francis Ormond in 1950.'}),
 'met-sketch': art(15382,{title:'Sketch of Clouds and Sea (from Sketchbook VII)',artist:'William Trost Richards',date:'1886',medium:'Graphite on off-white wove paper',status:listed,credit:'Purchase, Gifts in memory of Stephen D. Rubin, 1992 · 1992.2.1rr recto',theme:'people',alt:'Light graphite outlines and diagonal shading describe clouds, a horizon and waves on a cream sketchbook page.',detail:'This 1886 graphite drawing belongs to Richards’s Sketchbook VII. The Met describes the book as containing forty-six drawings in graphite and ink, mainly of New England landscapes and marine subjects. Its pages include both developed compositions and quick studies.'}),
};

const observations: Record<MetArtworkId,Omit<Mission,'prompt'>> = {
 'met-dawn': {title:'The first entry',question:'Where is the handwritten weather note?',options:['At the upper right','Across the bottom edge','Inside a painted building'],correct:0,hint:'Look along the top edge of the sheet, toward the right.',clue:'A sky with a timestamp',explanation:'The note is at upper right. The museum record explains its date, time and wind direction; those details give your imaginary archive a documented starting point.'},
 'met-sunset': {title:'Light in contrast',question:'Which colors brighten the gaps between the blue-gray clouds?',options:['Solid black','Yellow and orange','Bright green'],correct:1,hint:'Compare the warm bands near the horizon with the cooler clouds above.',clue:'Warm light, cool clouds',explanation:'Yellow and orange light contrasts with blue-gray clouds. This visible contrast also appears in the journal observations discussed by The Met.'},
 'met-paris': {title:'A sky above a city',question:'What anchors the sky to a place below?',options:['An empty ocean','A snowy mountain','Rooftops and a dome'],correct:2,hint:'Look below the clouds at the dark skyline.',clue:'A skyline gives scale',explanation:'Rooftops and a dome sit below the clouds. They give your comparison a visible reference for the expanse of sky; the Met title identifies Paris.'},
 'met-sea': {title:'Two negatives, one view',question:'According to the museum introduction, where do the two negatives meet?',options:['At the horizon','At the top edge','In the signature'],correct:0,hint:'Read the artwork introduction, then find the boundary between water and sky.',clue:'A constructed horizon',explanation:'The Met identifies the horizon as the join between the sea and sky negatives. This is documented photographic technique, not a secret invented for the story.'},
 'met-gouache': {title:'The page is part of the sky',question:'What color is the paper beneath the white gouache?',options:['Red','Blue','Black'],correct:1,hint:'Look at the broad area around the faint white clouds; the material is also in the caption.',clue:'Blue paper, white marks',explanation:'The blue support and white gouache are both visible and documented in the Met record. Your archive can compare this with a work made on white paper.'},
 'met-clouds': {title:'Room for the sky',question:'Which occupies most of this tall composition?',options:['A city street','A close-up face','The sky and clouds'],correct:2,hint:'Compare the large upper area with the narrow land and water at the bottom.',clue:'Give the sky space',explanation:'Clouds fill most of the vertical sheet. This is an observation about the image, not a claim about Sargent’s intentions.'},
 'met-sketch': {title:'An archive you can carry',question:'Which material does the Met record identify for this drawing?',options:['Graphite','Oil paint','Pastel'],correct:0,hint:'Read the medium beneath the image; notice the fine gray lines.',clue:'A sky in a few lines',explanation:'The medium is graphite on off-white wove paper. Your imaginary archive now includes photography, watercolor, pastel, gouache and graphite.'},
};
const tasks: Record<RoleId,Record<MetArtworkId,string>> = {
 detective: {
  'met-dawn':'Open an imaginary case file: how can an image record a changing sky? Begin with evidence written on the sheet.',
  'met-sunset':'Add a color clue to your case. Compare what light and clouds do when placed beside one another.',
  'met-paris':'Add a location clue. Search below the clouds for a visible link between the sky and a city.',
  'met-sea':'You have compared color and a city view. Now test how a convincing sky photograph was made: read the museum introduction before answering.',
  'met-gouache':'Trace another way to build a sky. Inspect the support as well as the marks on it.',
  'met-clouds':'Test how the amount of space changes your attention. Compare the sky with the landscape below.',
  'met-sketch':'Close your case by identifying the simplest tool in this final study. Build your conclusion from the evidence collected.'
 },
 collector: {
  'met-dawn':'Begin an imaginary collection of ways to record the sky. Find the note that makes this entry specific.',
  'met-sunset':'Choose a color relationship for your collection. Look for warm light between cool cloud shapes.',
  'met-paris':'Give your collection a sense of place. Find what sits beneath the photographed sky.',
  'met-sea':'Place this beside your first photograph and pastel. Read how the image was assembled before deciding how to describe it.',
  'met-gouache':'Collect a pairing of material and color. Look at what the white marks rest on.',
  'met-clouds':'Consider how to display a sky that fills a tall sheet. Find what the composition gives the most room.',
  'met-sketch':'Complete your imaginary collection with a drawing. Identify its material before writing your final label.'
 },
 artist: {
  'met-dawn':'Start an imaginary field sketchbook. Find the observation note you could learn from when recording your own sky.',
  'met-sunset':'Gather a lesson in color contrast. Compare the clouds with the light between them.',
  'met-paris':'Study a framing choice. Find how a small strip of city can accompany a large sky.',
  'met-sea':'Compare drawing with photographic construction. Read the documented process, then locate its joining line.',
  'met-gouache':'Plan a material experiment for your own sketchbook. Identify the page color beneath the marks.',
  'met-clouds':'Gather a lesson in proportion. Compare the space given to sky, land and water.',
  'met-sketch':'Finish with a portable drawing tool. Notice what a few lines can suggest, then imagine your own sky study.'
 },
 roulin: {
  'met-dawn':'As an imaginary present-day messenger, begin a sky guide for a friend. Find the note that supplies the first entry with a time.',
  'met-sunset':'Prepare a message about color. Choose a detail your friend can find without specialist knowledge.',
  'met-paris':'Give your friend a landmark within the image. Look beneath the cloud shapes.',
  'met-sea':'Make your message accurate: read the museum’s explanation of the two negatives before describing this view.',
  'met-gouache':'Send a small material discovery. Look at the page beneath the white marks.',
  'met-clouds':'Invite your friend to look upward. Notice how much of this sheet is given to clouds.',
  'met-sketch':'Complete your imaginary guide with something your friend could try. Identify the drawing material before suggesting a sky sketch.'
 }
};
export const metMissions = Object.fromEntries(Object.entries(tasks).map(([role,prompts])=>[role,Object.fromEntries(metArtworkIds.map(id=>[id,{...observations[id],prompt:prompts[id]}]))])) as Record<RoleId,Record<MetArtworkId,Mission>>;
const endings = (formTitle:string,peopleTitle:string,formText:string,peopleText:string): Record<Theme,{title:string;text:string}> => ({form:{title:formTitle,text:formText},people:{title:peopleTitle,text:peopleText}});
export const metRoles: Record<RoleId,Role> = {
 detective:{name:'The Detective',label:'Detective',subtitle:'Separate observation from technique.',symbol:'search',story:'An imaginary sky archive needs an evidence trail. Inspect seven real works, compare their materials and views, and decide whether your final case follows observation or image-making.',endings:endings('The Image-Making Case','The Observation Case','You file a case about how images are made: contrasting colors, a joined photograph, and marks on different papers. Your fictional archive makes its evidence and sources visible.','You file a case about looking: a dated note, a city skyline and a sky-filled sheet. Your fictional archive records observations without inventing the artists’ thoughts.')},
 collector:{name:'The Collector',label:'Collector',subtitle:'Gather seven ways to hold a sky.',symbol:'frames',story:'Build an imaginary collection of sky studies. Your choices decide whether the collection emphasizes close observation or the materials and techniques that give an image form.',endings:endings('The Cabinet of Methods','The Cabinet of Looking','Your imagined collection pairs works by method: pastel beside watercolor, a constructed photograph beside a graphite drawing. The labels explain what each source actually supports.','Your imagined collection invites viewers to compare time, place and scale. Seven distinct works become a guide to looking, with each historical claim linked to a museum record.')},
 artist:{name:'The Artist',label:'Artist',subtitle:'Build a sketchbook of possibilities.',symbol:'pen',story:'Fill an imaginary sketchbook with lessons from seven documented works. Choose whether your next study begins with an observation or with an experiment in materials.',endings:endings('The Studio of Sky','The Open-Air Notebook','Your imaginary sketchbook ends with an experiment: compare white marks on blue paper with gray lines on a pale page. Make something of your own, and label what you tried.','Your imaginary sketchbook ends with an invitation to look outside. Record the time and a detail you can see, then draw it. Your observation belongs to you, not to the historical artists.')},
 roulin:{name:'The Messenger',label:'Messenger',subtitle:'Share a sky guide with a friend.',symbol:'mail',story:'Play an invented present-day messenger assembling a guide for a friend. Gather seven accurate introductions and decide whether to share a trail of observations or a trail of techniques. This role is not a historical person.',endings:endings('A Letter About Making','A Letter About Looking','Your imaginary letter explains that a sky image is also made of choices: color, paper, lines and photographic technique. It invites your friend to inspect the works and their sources.','Your imaginary letter asks your friend to notice a date, a skyline and the space around a cloud. You share a way of looking while keeping facts separate from your own story.')},
};
