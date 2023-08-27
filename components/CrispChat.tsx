'use client';

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

const CrispChat = () => {
	useEffect(() => {
		Crisp.configure('24670063-5af6-46cf-bce3-ef5b5595cb6c');
	}, []);

	return null;
};

export default CrispChat;
