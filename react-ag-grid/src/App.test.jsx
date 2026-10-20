import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import App from './App';

let container;
let root;

afterEach(async () => {
    try {
        if (root) {
            await act(async () => root.unmount());
        }
    }
    finally {
        root = null;
        container?.remove();
        vi.useRealTimers();
        vi.unstubAllGlobals();
    }
});

it('renders the heading and three grids, then unmounts cleanly', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

    // jsdom has no layout engine or ResizeObserver. Keep the real AG Grid
    // components, but supply the browser API they need to mount.
    vi.stubGlobal('ResizeObserver', class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });

    // Workers are the network boundary: mounting should never contact AMPS.
    const workers = [];
    vi.stubGlobal('Worker', class {
        constructor() { workers.push(this); }
        postMessage = vi.fn();
        terminate = vi.fn();
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => root.render(<App />));
    await act(async () => { await vi.runOnlyPendingTimersAsync(); });

    expect(container.querySelector('h1').textContent.trim()).toBe('AMPS ag-grid View Server');
    expect(Array.from(container.querySelectorAll('.grid-title'), title => title.textContent)).toEqual([
        'Orders',
        'VWAP',
        'VWAP (Dynamic Aggregation)',
    ]);
    expect(container.querySelectorAll('.ag-root')).toHaveLength(3);
    expect(workers).toHaveLength(3);

    await act(async () => root.unmount());
    root = null;

    expect(container.childElementCount).toBe(0);
    for (const worker of workers) {
        expect(worker.postMessage).toHaveBeenLastCalledWith({ disconnect: true });
        expect(worker.terminate).toHaveBeenCalledOnce();
    }
});
