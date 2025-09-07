// src/components/SvgParallaxScroll.js
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './SvgParallaxScroll.css'; // Import the CSS

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SvgParallaxScroll = () => {
    const scrollDistRef = useRef(null);
    const svgContainerRef = useRef(null); // Ref for the main SVG container (was 'main')
    // Refs for animatable SVG elements
    const skyRef = useRef(null);
    const cloud1Ref = useRef(null); // This is also used in the mask
    const cloud1MaskRectRef = useRef(null); // For the rect inside cloud1 group in mask
    const cloud1MaskImageRef = useRef(null); // For the image inside cloud1 group in mask
    const cloud2Ref = useRef(null);
    const cloud3Ref = useRef(null);
    const mountBgRef = useRef(null);
    const mountMgRef = useRef(null);
    const mountFgRef = useRef(null);
    const arrowRef = useRef(null);
    const arrowBtnRef = useRef(null); // The invisible rect for arrow click

    useEffect(() => {
        if (!scrollDistRef.current || !svgContainerRef.current) {
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollDistRef.current,
                start: 'top top', // When the top of scrollDist hits the top of the viewport
                end: 'bottom bottom', // When the bottom of scrollDist hits the bottom of the viewport
                scrub: 1, // Smooth scrubbing
                // markers: process.env.NODE_ENV === 'development', // Uncomment for debugging
            }
        });

        // Parallax animations
        // Note: The y values are from your original JS. Adjust if needed.
        // The 0 at the end of each fromTo is the position in the timeline (all start at the same time)
        if (skyRef.current) tl.fromTo(skyRef.current, { y: 0 }, { y: -200 }, 0);

        // For the cloud1 in the mask, we need to animate its children if they are what moves
        // The CodePen animates '.cloud1' which is a <g> tag.
        // GSAP can animate SVG <g> transforms directly.
        if (cloud1Ref.current) tl.fromTo(cloud1Ref.current, { y: 100 }, { y: -800 }, 0);
        // If you intended to animate parts within the mask's cloud1 <g> tag:
        // if (cloud1MaskRectRef.current) tl.fromTo(cloud1MaskRectRef.current, { y: 799 }, { y: -1 }, 0); // Example, adjust values
        // if (cloud1MaskImageRef.current) tl.fromTo(cloud1MaskImageRef.current, { y: 0 }, { y: -800 }, 0); // Example

        if (cloud2Ref.current) tl.fromTo(cloud2Ref.current, { y: -150 }, { y: -500 }, 0);
        if (cloud3Ref.current) tl.fromTo(cloud3Ref.current, { y: -50 }, { y: -650 }, 0);
        if (mountBgRef.current) tl.fromTo(mountBgRef.current, { y: -10 }, { y: -100 }, 0);
        if (mountMgRef.current) tl.fromTo(mountMgRef.current, { y: -30 }, { y: -250 }, 0);
        if (mountFgRef.current) tl.fromTo(mountFgRef.current, { y: -50 }, { y: -600 }, 0);


        // Arrow button event listeners
        const arrowButton = arrowBtnRef.current;
        const arrowElement = arrowRef.current;

        const handleMouseEnter = () => {
            if (arrowElement) gsap.to(arrowElement, { y: 10, duration: 0.8, ease: 'back.inOut(3)', overwrite: 'auto' });
        };
        const handleMouseLeave = () => {
            if (arrowElement) gsap.to(arrowElement, { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        };
        const handleClick = () => {
            // Scrolls the window to the height of one viewport.
            // Ensure your page has content below this for scrolling to make sense,
            // or that this is the end of the "About" section.
            gsap.to(window, { scrollTo: window.innerHeight, duration: 1.5, ease: 'power1.inOut' });
        };

        if (arrowButton) {
            arrowButton.addEventListener('mouseenter', handleMouseEnter);
            arrowButton.addEventListener('mouseleave', handleMouseLeave);
            arrowButton.addEventListener('click', handleClick);
        }

        // Cleanup function
        return () => {
            tl.kill(); // Kill the timeline
            ScrollTrigger.getAll().forEach(st => st.kill()); // Kill all scroll triggers created by this component
            if (arrowButton) {
                arrowButton.removeEventListener('mouseenter', handleMouseEnter);
                arrowButton.removeEventListener('mouseleave', handleMouseLeave);
                arrowButton.removeEventListener('click', handleClick);
            }
        };

    }, []); // Empty dependency array: runs once on mount, cleans up on unmount

    return (
        <div className="parallax-container"> {/* Wrapper for better style scoping */}
            <div ref={scrollDistRef} className="scrollDist"></div>
            <div ref={svgContainerRef} className="parallax-main-content"> {/* Was 'main' */}
                <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
                    <mask id="m">
                        {/*
                          The original CodePen animates the <g class="cloud1">.
                          If this <g> itself is transformed, its children (rect and image)
                          will move with it. So, we only need a ref on the <g> tag.
                        */}
                        <g ref={cloud1Ref} className="cloud1"> {/* This group is targeted by GSAP */}
                            <rect fill="#fff" width="100%" height="801" y="799" />
                            <image xlinkHref="https://assets.codepen.io/721952/cloud1Mask.jpg" width="1200" height="800"/>
                        </g>
                    </mask>

                    <image ref={skyRef} className="sky" xlinkHref="https://assets.codepen.io/721952/sky.jpg" width="1200" height="590" />
                    <image ref={mountBgRef} className="mountBg" xlinkHref="https://assets.codepen.io/721952/mountBg.png" width="1200" height="800"/>
                    <image ref={mountMgRef} className="mountMg" xlinkHref="https://assets.codepen.io/721952/mountMg.png" width="1200" height="800"/>
                    <image ref={cloud2Ref} className="cloud2" xlinkHref="https://assets.codepen.io/721952/cloud2.png" width="1200" height="800"/>
                    <image ref={mountFgRef} className="mountFg" xlinkHref="https://assets.codepen.io/721952/mountFg.png" width="1200" height="800"/>
                    {/*
                        The original animation targets '.cloud1' for a parallax effect.
                        This refers to the <g class="cloud1"> inside the <mask>.
                        However, there's also an <image class="cloud1"...> below.
                        If you want this visible cloud image to also parallax, it needs its own ref
                        and its own animation line in the timeline.
                        For now, I am assuming the primary animated "cloud1" is the one in the mask,
                        as per your GSAP code targeting `.cloud1`.
                        If this image below is also meant to be `.cloud1` and animate,
                        you'd need to give it a unique ref or class if the animation differs,
                        or use the same class if it animates identically to the one in the mask.
                        Let's assume for now the mask's cloud1 is the primary one for that parallax.
                        If this visible one is also `cloud1` and should animate, it might already be covered
                        if GSAP selects both (not ideal for specific control).
                        I'll remove the ref from this one to avoid confusion with the mask's cloud1,
                        unless you clarify it also needs independent or identical animation.
                    */}
                    <image className="cloud1" xlinkHref="https://assets.codepen.io/721952/cloud1.png" width="1200" height="800"/>
                    <image ref={cloud3Ref} className="cloud3" xlinkHref="https://assets.codepen.io/721952/cloud3.png" width="1200" height="800"/>

                    <text fill="#fff" x="400" y="200"> Explore</text>
                    <polyline ref={arrowRef} className="arrow" fill="#fff" points="599,250 599,289 590,279 590,282 600,292 610,282 610,279 601,289 601,250" />

                    <g mask="url(#m)">
                        <rect fill="#fff" width="100%" height="100%" />
                        <text x="350" y="200" fill="#162a43">About Us</text>
                    </g>

                    <rect ref={arrowBtnRef} id="arrow-btn" width="100" height="100" opacity="0" x="550" y="220" style={{ cursor: 'pointer' }}/>
                </svg>
            </div>
        </div>
    );
};

export default SvgParallaxScroll;