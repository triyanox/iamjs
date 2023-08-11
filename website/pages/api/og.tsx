/* eslint-env node */
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge'
};

const font = fetch(new URL('./Poppins-Regular.ttf', import.meta.url)).then((res) =>
  res.arrayBuffer()
);

export default async function (req) {
  const inter = await font;

  const { searchParams } = new URL(req.url);

  // ?title=<title>
  const hasTitle = searchParams.has('title');
  const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'Nextra Documentation';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 80,
          backgroundColor: '#030303',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          backgroundPosition: '-30px -10px',
          fontWeight: 600,
          color: 'white'
        }}
      >
        <p
          style={{
            position: 'absolute',
            bottom: 70,
            left: 80,
            margin: 0,
            fontSize: 30,
            letterSpacing: -1
          }}
        >
          The complete access control solution
        </p>
        <h1
          style={{
            fontSize: 82,
            margin: '0 0 40px -2px',
            lineHeight: 1.1,
            textShadow: '0 2px 30px #000',
            letterSpacing: -4,
            backgroundImage: 'linear-gradient(90deg, #fff 40%, #aaa)',
            backgroundClip: 'text',
            '-webkit-background-clip': 'text',
            color: 'transparent'
          }}
        >
          <span
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translateY(-8px)',
              marginRight: 8
            }}
          >
            <svg height={84} viewBox="0 0 564 671" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M247.36 5.32968L64.026 73.9963C29.026 87.3297 0.359344 128.663 0.359344 166.33V436.33C0.359344 463.33 18.026 498.997 39.6927 514.997L223.027 651.997C255.36 676.33 308.36 676.33 340.693 651.997L524.027 514.997C545.693 498.663 563.36 463.33 563.36 436.33V166.33C563.36 128.996 534.693 87.3293 499.693 74.3293L316.36 5.66301C297.693 -1.67032 266.36 -1.67032 247.36 5.32968Z"
                style={{
                  fill: '#3f3f46'
                }}
              />
              <path
                d="M365.333 285C365.333 239 328 201.667 282 201.667C236 201.667 198.667 239 198.667 285C198.667 322.333 223.333 353.333 257 364V451.667C257 465.333 268.333 476.667 282 476.667C295.667 476.667 307 465.333 307 451.667V364C340.667 353.333 365.333 322.333 365.333 285Z"
                style={{ fill: '#d4d4d8' }}
              />
            </svg>
          </span>
          {title}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'inter',
          data: inter,
          style: 'normal'
        }
      ]
    }
  );
}
