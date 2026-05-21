export default (
    <style>
        {`
#decky-steamhunter {
    position: relative;
}

.sh-info {
    background: rgba(14, 20, 27, 0.25);
    position: relative;
    border-bottom: 2px solid rgba(61, 68, 80, 0.54);
    padding: 8px 16px 26px 24px;
}

.sh-body {
    width: 100%;
    max-width: 540px;
    min-height: 124px;
    margin: 0 auto;
    box-sizing: border-box;
}

.sh-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 16px;
    width: 100%;
}

.sh-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 36px;
}

.sh-meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.sh-cell-empty {
    visibility: hidden;
}

.sh-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 124px;
    max-height: 124px;
    overflow: hidden;
    box-sizing: border-box;
}

.sh-loading .sh-spinner,
.sh-loading .sh-spinner svg {
    width: 28px !important;
    height: 28px !important;
    max-width: 28px;
    max-height: 28px;
    flex-shrink: 0;
}

.sh-single-stat {
    display: flex;
    justify-content: center;
    padding: 4px 0;
}

.sh-value {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    line-height: 1.2;
}

.sh-label {
    font-size: 10px;
    text-transform: uppercase;
    margin: 0;
    opacity: 0.85;
    line-height: 1.2;
}

.sh-icon {
    font-size: 11px;
    opacity: 0.7;
    flex-shrink: 0;
}

.sh-footer {
    position: absolute;
    right: 12px;
    bottom: 6px;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
}

.sh-link-btn {
    pointer-events: auto;
    background: transparent;
    border: none;
    color: #1a9fff;
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.1;
    padding: 2px 0;
    margin: 0;
    cursor: pointer;
    white-space: nowrap;
}

.sh-link-btn:hover,
.sh-link-btn:focus {
    color: #fff;
    outline: none;
}
`}
    </style>
);
