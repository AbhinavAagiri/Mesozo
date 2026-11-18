import { useEffect } from 'react';
import { formatAgeNumber, getGeoUnit } from '../data';
import { ScrollTrigger } from '../lib/gsap';
import { usePageTitle } from '../lib/usePageTitle';
import { Ticker } from '../components/ui/Ticker';
import { Hero } from '../sections/home/Hero';
import { DeepTimeBand } from '../sections/home/DeepTimeBand';
import { Specimens } from '../sections/home/Specimens';
import { Evidence } from '../sections/home/Evidence';
import { DiscoveryBand } from '../sections/home/DiscoveryBand';
import { Closing } from '../sections/home/Closing';
import '../styles/home.css';

const TICKER = [
  ...['triassic', 'jurassic', 'cretaceous', 'paleogene']
    .map((id) => {
      const unit = getGeoUnit(id);
      return unit
        ? `${unit.name} — ${formatAgeNumber(unit.startMa)} to ${formatAgeNumber(unit.endMa)} Ma`
        : null;
    })
    .filter((item): item is string => Boolean(item)),
  'The world before us',
];

export default function Home() {
  usePageTitle();

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <Hero />
      <div className="home-after">
        <Ticker items={TICKER} label="Deep time" />
        <DeepTimeBand />
        <Specimens />
        <Evidence />
        <DiscoveryBand />
        <Closing />
      </div>
    </>
  );
}
