import { useState, useEffect } from 'react';
import get from 'lodash/get';
import FontFaceObserver from 'fontfaceobserver';
import Cookie from 'js-cookie';

const useLoadFonts = ({ cookies = {} }) => {
  const loaded = JSON.parse(get(cookies, 'fontsLoaded', false));
  const [fontsLoaded, setFontsLoaded] = useState(loaded);

  useEffect(() => {
    if (fontsLoaded) return;

    Promise.all([
      new FontFaceObserver('Barlow', { weight: 400 }).load(),
      new FontFaceObserver('Barlow', { weight: 400, style: 'italic' }).load(),
      new FontFaceObserver('Barlow', { weight: 700 }).load(),
      new FontFaceObserver('Barlow', { weight: 700, style: 'italic' }).load(),
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
      Cookie.set('fontsLoaded', true, { sameSite: 'lax' });
      setFontsLoaded(true);
    });
  });

  return { fontsLoaded, setFontsLoaded };
};

export default useLoadFonts;
