import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="BulletBuzz - Auto-Battler Game">
      <main style={{
        padding: 0,
        margin: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}>
        <iframe
          src="/bulletbuzz/index.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0
          }}
          title="BulletBuzz Game"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </main>
    </Layout>
  );
}
