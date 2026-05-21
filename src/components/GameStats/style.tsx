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
    padding: 8px 24px;
}

.sh-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 16px;
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
}

.sh-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 52px;
}

.sh-cell-empty {
    visibility: hidden;
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
    font-size: 12px;
    opacity: 0.7;
    margin: 2px 0;
}

.sh-footer {
    display: flex;
    justify-content: center;
    padding-top: 6px;
}

.sh-details-btn {
    background: transparent !important;
    color: #1a9fff !important;
    margin: auto !important;
    font-size: 10px !important;
    font-weight: bold !important;
    text-transform: uppercase;
    line-height: 10px !important;
}

.sh-details-btn:focus,
.sh-details-btn:hover {
    color: white !important;
}
`}
    </style>
);
