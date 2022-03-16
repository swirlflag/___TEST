import barba from "@barba/core";

barba.init({
	transitions: [
		{
			name: "page1",
            to: { namespace: ['page1'] },
			leave(data) {
				return gsap.to(data.current.container, {
					opacity: 0,
				});
			},
			enter(data) {
				return gsap.from(data.next.container, {
					opacity: 0,
				});
			},
		},

		{
			name: "page2",
            to: { namespace: ['page2'] },
			leave(data) {
				return gsap.to(data.current.container, {
					opacity: 0,
				});
			},
			enter(data) {
				return gsap.from(data.next.container, {
					opacity: 0,
				});
			},
		},
		{
			name: "page3",
            to: { namespace: ['page3'] },
			leave(data) {
				return gsap.to(data.current.container, {
					opacity: 0,
				});
			},
			enter(data) {
				return gsap.from(data.next.container, {
					opacity: 0,
				});
			},
		},
	],
});
