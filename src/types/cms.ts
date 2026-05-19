export interface CMSResponse {
  success: boolean;
  data: CMSData;
}

export interface CMSData {
  about: any;
  contact: any;
  home: HomePageContent;
  shared: SharedContent;
}

export interface SharedContent {
  footer: FooterContent;
  forms: {
    emailLaunchForm: EmailLaunchFormContent;
  };
}

export interface EmailLaunchFormContent {
  api: {
    method: string;
    payload: Record<string, any>;
    endpoint: string;
  };
  errorToast: string;
  buttonLabel: string;
  successToast: string;
  inputPlaceholder: string;
  buttonLoadingLabel: string;
}

export interface FooterContent {
  brand: {
    logoColor: string;
    tagline: string;
  };
  quickLinksTitle: string;
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
  contactTitle: string;
  contact: {
    phone: {
      display: string;
      href: string;
    };
    email: {
      display: string;
      href: string;
    };
    address: string;
  };
  connectTitle: string;
  socialLinks: Array<{
    platform: string;
    href: string;
    ariaLabel: string;
    iconKey: string;
  }>;
  newsletter: {
    title: string;
    input: {
      placeholder: string;
      ariaLabel: string;
    };
    button: {
      defaultLabel: string;
      loadingLabel: string;
    };
    api: {
      endpoint: string;
      method: string;
      payload: Record<string, any>;
    };
  };
  copyrightText: string;
}

export interface HomePageContent {
  hero: {
    sectionId: string;
    backgroundVideo: {
      src: string;
      stopBeforeEndSeconds: number;
    };
    headlineLines: string[];
    description: string;
    newsletterCard: {
      title: string;
      formType: string;
    };
  };
  delayedEmergencyResponse: {
    title: {
      prefix: string;
      highlight: string;
    };
    subtitle: string;
    backgroundImage: string;
    statsCards: Array<{
      value: string;
      valueCaption: string;
      title: string;
      description: string;
    }>;
    closingLine: {
      prefix: string;
      brand: string;
      suffix: string;
    };
  };
  buildingSection: {
    sectionId: string;
    title: {
      prefix: string;
      highlight: string;
    };
    description: string;
    carouselCards: Array<{
      title: string;
      iconKey: string;
      bullets: string[];
    }>;
    supportImage: {
      src: string;
      alt: string;
    };
  };
  lifelineSection: {
    title: {
      prefix: string;
      highlight: string;
      suffix: string;
    };
    description: string;
    featureCards: Array<{
      title: string;
      descriptionLines: string[];
      iconKey: string;
      image: string;
    }>;
    newsletterCta: {
      label: string;
      form: {
        source: string;
        type: string;
      };
    };
  };
  comingSoonSection: {
    revealHeading: string;
    productImage: {
      src: string;
      alt: string;
    };
    titleLines: string[];
    subtitle: string;
    form: {
      source: string;
      type: string;
    };
  };
  inActionVideos: {
    mobileSection: {
      sectionId: string;
      videoSrc: string;
      controls: boolean;
    };
    desktopSection: {
      sectionId: string;
      videoSrc: string;
      controls: boolean;
    };
  };
  testimonialsSection: {
    title: {
      prefix: string;
      highlight: string;
    };
    description: string;
    cards: Array<{
      id: number;
      name: string;
      role: string;
      avatar: string;
      rating: number;
      feedback: string;
      videoTitle: string;
      videoSrc: string;
      buttonLabel: string;
    }>;
    modal: {
      closeAriaLabel: string;
      overlayCloseAriaLabel: string;
      fallbackText: string;
    };
  };
  liveImpactUpdates: {
    title: {
      prefix: string;
      highlight: string;
    };
    description: string;
    items: Array<{
      title: string;
      paragraph: string;
      date: string;
      time: string;
      image: string;
      sourceLink: string;
      country: string;
    }>;
  };
  instagramReels: {
    title: {
      prefix: string;
      highlight: string;
    };
    description: string;
    reels: Array<{
      videoPath: string;
      title: string;
      subtitle: string;
      link: string;
    }>;
  };
  guidesResourcesSection: {
    sectionId: string;
    title: {
      prefix: string;
      highlight: string;
    };
    description: string;
    guides: Array<{
      title: string;
      subtitle: string;
      image: string;
      fileUrl: string;
      description: string;
      date: string;
      downloadIconKey: string;
    }>;
  };
  communitySection: {
    tag: string;
    title: string;
    description: string;
    featureHighlights: string[];
    card: {
      title: string;
      description: string;
      joinTrigger: {
        helperText: string;
        inputPlaceholder: string;
        buttonLabel: string;
      };
      joinModal: {
        title: string;
        subtitle: string;
        fields: {
          firstNameLabel: string;
          lastNameLabel: string;
          phoneLabel: string;
          stateLabel: string;
          statePlaceholder: string;
          emailLabel: string;
          captchaTitle: string;
          captchaInstructionLabel: string;
          captchaPlaceholder: string;
        };
        buttonLabel: string;
        buttonLoadingLabel: string;
        validationErrors: Record<string, string>;
        api: {
          endpoint: string;
          method: string;
          payload: Record<string, any>;
        };
        successToast: string;
        errorToast: string;
      };
    };
  };
}
