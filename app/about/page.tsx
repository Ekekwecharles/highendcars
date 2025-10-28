"use client";
import React from "react";
import styled from "styled-components";

const AboutPageContainer = styled.div`
  p {
    line-height: 1.7;
  }

  .list-header {
    font-size: 1.2rem;
  }

  ul {
    margin-left: 1.5rem;
  }

  a {
    color: blue;
    text-decoration: underline;
  }
`;

export default function AboutPage() {
  return (
    <AboutPageContainer
      style={{
        padding: "2rem",
        maxWidth: 800,
        margin: "0 auto",
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "1.2rem",
          textAlign: "center",
        }}
      >
        About HighEnd Cars
      </h1>

      <p>
        At <strong>HighEnd Cars</strong>, we understand that owning a luxury car
        is more than just a symbol of status — it’s a lifestyle. Yet, many
        high-end car owners often find it difficult to sell their vehicles when
        it’s time for an upgrade. The market for luxury and exotic cars is
        limited, and those nearby may not always share the same taste or
        purchasing power.
      </p>

      <p>
        That’s where we come in. Our platform connects luxury car owners with
        buyers all over the world. We promote, showcase, and ship high-end
        vehicles globally — ensuring that your car gets the visibility and
        attention it truly deserves.
      </p>

      <br />
      <p className="list-header">
        Beyond buying and selling, <strong>we deal in everything cars</strong>:
      </p>

      <ul>
        <li>Brand new and certified used cars</li>
        <li>Car parts and performance accessories</li>
        <li>Automotive software and cutting-edge car technology</li>
        <li>Professional car repairs by our top-tier engineers</li>
      </ul>
      <br />

      <p>
        As we grow, our vision is to take things even further — with plans to
        design and produce our very own line of luxury vehicles in the future.
      </p>

      <p>
        Have questions or need assistance? You can always chat with our support
        team directly from the platform, or reach us via email at{" "}
        <a href="mailto:highendcars@gmail.com">highendcars@gmail.com</a>.
      </p>

      <p style={{ fontWeight: 600, marginTop: "1rem", color: "gold" }}>
        HighEnd Cars — Where luxury meets innovation.
      </p>
    </AboutPageContainer>
  );
}
